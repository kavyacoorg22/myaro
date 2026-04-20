import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";
import {
  PaymentStatus,
  RefundMethod,
  RefundStatus,
  RefundType,
} from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository } from "../../../domain/repositoryInterface/User/booking/IRefundRepository";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ICancelBookingUseCase } from "../../interface/booking/ICancelBooking";
import {
  ICancelBookingInput,
  ICancelBookingOutput,
} from "../../interfaceType/booking";
import { toCancelBookingDto } from "../../mapper/bookingMapper";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { BookingValidatorService } from "../../services/bookingValidatorService";
import { ChatMessageService } from "../../services/chatMessageService";
import { NotificationDispatchService } from "../../services/notificationDispatchService";
import { PaymentLookupService } from "../../services/paymentLookupService";

export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private _bookingValidator: BookingValidatorService,
    private _paymentLookup: PaymentLookupService,
    private _bookingHistory: BookingHistoryService,
    private _chatMessage: ChatMessageService,
    private _socketEmitter: ISocketEmitter,
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _refundRepo: IRefundRepository,
    private _paymentService: IPaymentService,
    private _notificationService: NotificationDispatchService,
  ) {}

  async execute(input: ICancelBookingInput): Promise<ICancelBookingOutput> {
    const { bookingId, userId } = input;

    // ── 1. Validate: ownership + must be CONFIRMED ─────────────────────────
    const booking = await this._bookingValidator.getAndValidateStatus(
      bookingId,
      userId,
      "userId",
      [BookingStatus.CONFIRMED],
    );

    // ── 2. Validate: cancellation must be > 3 days before booking ──────────
    const slotDate = new Date(booking.slot.date);
    const diffDays = (slotDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 3) {
      throw new AppError(
        "Cancellation is not allowed within 3 days of the booking date.",
        HttpStatus.BAD_REQUEST,
      );
    }

    // ── 3. Validate: payment exists and is in a refundable state ───────────
    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.PAID,
    ]);

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        "Razorpay payment ID is missing. Cannot process refund.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ── 4. Idempotency: ensure refund doesn't already exist ────────────────
    const existing = await this._refundRepo.findByPaymentId(payment.id);
    if (existing) {
      throw new AppError(
        "A refund for this booking already exists.",
        HttpStatus.CONFLICT,
      );
    }

    // ── 7. Call Razorpay refund directly (no admin approval needed) ─────────
    const razorpayRefund = await this._paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );

    // ── 8. Persist refund record ───────────────────────────────────────────
    const refund = await this._refundRepo.create({
      userId: booking.userId,
      paymentId: payment.id,
      amount: payment.amount,
      method: RefundMethod.WALLET,
      status:
        razorpayRefund.status === "processed"
          ? RefundStatus.SUCCESS
          : RefundStatus.PENDING,
      refundType: RefundType.CANCELLATION,
      razorpayRefundId: razorpayRefund.id,
      reason: "Customer cancelled booking more than 3 days in advance.",
      processedAt: new Date(),
    });

    await this._bookingRepo.updateByBookingId(bookingId, {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      ...(razorpayRefund.status === "processed" && {
        refundType: RefundType.CANCELLATION,
      }),
    });

    await this._paymentRepo.updateById(payment.id, {
      status:
        razorpayRefund.status === "processed"
          ? PaymentStatus.REFUNDED
          : PaymentStatus.REFUND_INITIATED,

      refundedId: refund.id,
      refundReason: "Customer cancelled booking",
    });
    // ── 9. Log booking history ─────────────────────────────────────────────
    await this._bookingHistory.log({
      bookingId,
      action: BookingAction.CANCEL,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: BookingStatus.CONFIRMED,
      toStatus: BookingStatus.CANCELLED,
    });
    const message = ACTION_MESSAGE[BookingAction.CANCEL];
    const chatMessage = CHAT_ACTION_MESSAGE[BookingAction.CANCEL];
    const title = ACTION_TITLE[BookingAction.CANCEL];

    await this._chatMessage.sendAndEmit({
      chatId: booking.chatId,
      senderId: userId,
      receiverId: booking.beauticianId,
      message: chatMessage,
      type: MessageType.BOOKING,
      bookingId,
      status: BookingStatus.CANCELLED,
    });

    await this._notificationService.notify({
      userId: booking.beauticianId,
      type: NotificationType.BOOKING,
      category: NotificationCategory.BOOKING,
      title,
      message,
      socketEvent: SOCKET_EVENTS.BOOKING_CANCELLED,
      socketPayload: {
        bookingId,
        amount: payment.amount,
        message,
      },
      metadata: { bookingId },
    });

    const data = toCancelBookingDto({ refund, payment });

    return { data };
  }
}
