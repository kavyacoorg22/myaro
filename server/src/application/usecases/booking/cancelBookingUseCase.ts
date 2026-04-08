import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
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
import { PaymentLookupService } from "../../services/paymentLookupService";

export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    private bookingValidator: BookingValidatorService,
    private paymentLookup: PaymentLookupService,
    private bookingHistory: BookingHistoryService,
    private chatMessage: ChatMessageService,
    private socketEmitter: ISocketEmitter,
    private bookingRepo: IBookingRepository,
    private paymentRepo: IPaymentRepository,
    private refundRepo: IRefundRepository,
    private paymentService: IPaymentService,
  ) {}

  async execute(input: ICancelBookingInput): Promise<ICancelBookingOutput> {
    const { bookingId, userId } = input;

    // ── 1. Validate: ownership + must be CONFIRMED ─────────────────────────
    const booking = await this.bookingValidator.getAndValidateStatus(
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
    const payment = await this.paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.PAID,
    ]);

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        "Razorpay payment ID is missing. Cannot process refund.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ── 4. Idempotency: ensure refund doesn't already exist ────────────────
    const existing = await this.refundRepo.findByPaymentId(payment.id);
    if (existing) {
      throw new AppError(
        "A refund for this booking already exists.",
        HttpStatus.CONFLICT,
      );
    }

    // ── 7. Call Razorpay refund directly (no admin approval needed) ─────────
    const razorpayRefund = await this.paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );

    // ── 8. Persist refund record ───────────────────────────────────────────
    const refund = await this.refundRepo.create({
      paymentId: payment.id,
      amount: payment.amount,
      method: RefundMethod.SOURCE,
      status:
        razorpayRefund.status === "processed"
          ? RefundStatus.SUCCESS
          : RefundStatus.PENDING,
      refundType: RefundType.CANCELLATION,
      razorpayRefundId: razorpayRefund.id,
      reason: "Customer cancelled booking more than 3 days in advance.",
    });

    await this.bookingRepo.updateByBookingId(bookingId, {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      ...(razorpayRefund.status === "processed" && {
        refundType: RefundType.CANCELLATION,
      }),
    });

    await this.paymentRepo.updateById(payment.id, {
      status:
        razorpayRefund.status === "processed"
          ? PaymentStatus.REFUNDED
          : PaymentStatus.REFUND_INITIATED,

      refundedId:refund.id,
      refundReason: "Customer cancelled booking",
    });
    // ── 9. Log booking history ─────────────────────────────────────────────
    await this.bookingHistory.log({
      bookingId,
      action: BookingAction.CANCEL,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: BookingStatus.CONFIRMED,
      toStatus: BookingStatus.CANCELLED,
    });

    // ── 10. Notify beautician via chat + socket ────────────────────────────
    await this.chatMessage.sendAndEmit({
      chatId: booking.chatId,
      senderId: userId,
      receiverId: booking.beauticianId,
      message:
        "The customer has cancelled this booking. A refund has been initiated.",
      type: MessageType.BOOKING,
      bookingId,
      status: BookingStatus.CANCELLED,
    });

    this.socketEmitter.emitToRoom(
      `user:${booking.beauticianId}`,
      SOCKET_EVENTS.BOOKING_CANCELLED,
      { bookingId, refundAmount: payment.amount },
    );

    const data = toCancelBookingDto({ refund, payment });

    return { data };
  }
}
