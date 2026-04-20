import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import {
  PaymentStatus,
  RefundMethod,
  RefundStatus,
  RefundType,
} from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { BookingValidatorService } from "../../services/bookingValidatorService";
import { PaymentLookupService } from "../../services/paymentLookupService";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { ChatMessageService } from "../../services/chatMessageService";
import { MessageType } from "../../../domain/enum/messageEnum";
import { IRefundRepository } from "../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { IBeauticianApproveRefundUInput } from "../../interfaceType/booking";
import { IBeauticianApproveRefundUseCase } from "../../interface/booking/IBeauticianApproveRefundUseCase";
import { NotificationDispatchService } from "../../services/notificationDispatchService";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";

export class BeauticianApproveRefundUseCase implements IBeauticianApproveRefundUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _socketEmitter: ISocketEmitter,
    private _bookingValidator: BookingValidatorService,
    private _bookingHistory: BookingHistoryService,
    private _paymentLookup: PaymentLookupService,
    private _chatMessage: ChatMessageService,
    private _refundrepo: IRefundRepository,
    private _notificationService: NotificationDispatchService,
  ) {}

  async execute(input: IBeauticianApproveRefundUInput): Promise<Booking> {
    const { bookingId, beauticianId } = input;

    const booking = await this._bookingValidator.getAndValidateStatus(
      bookingId,
      beauticianId,
      "beauticianId",
      [BookingStatus.REFUND_REQUESTED],
    );

    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.REFUND_REQUESTED,
    ]);

    await this._refundrepo.create({
      userId: booking.userId,
      paymentId: payment.id,
      amount: payment.amount,
      method: RefundMethod.WALLET,
      status: RefundStatus.PENDING,
      refundType: RefundType.SERVICE_ISSUE,
      reason: booking.refundReason ?? undefined,
    });

    await this._paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.BEAUTICIAN_APPROVED_REFUND,
    );

    const updatedBooking = await this._bookingRepo.updateByBookingId(
      bookingId,
      {
        status: BookingStatus.REFUND_APPROVED,
      },
    );

    if (!updatedBooking) {
      throw new AppError(
        "Failed to update booking",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this._bookingHistory.log({
      bookingId,
      action: BookingAction.APPROVE_REFUND,
      performedBy: beauticianId,
      role: UserRole.BEAUTICIAN,
      fromStatus: BookingStatus.REFUND_REQUESTED,
      toStatus: BookingStatus.REFUND_APPROVED,
    });
    const message = ACTION_MESSAGE[BookingAction.APPROVE_REFUND];
    const chatMessage = CHAT_ACTION_MESSAGE[BookingAction.APPROVE_REFUND];
    const title = ACTION_TITLE[BookingAction.APPROVE_REFUND];
    await this._chatMessage.sendAndEmit({
      chatId: booking.chatId,
      senderId: beauticianId,
      receiverId: booking.userId,
      message: chatMessage,
      type: MessageType.BOOKING,
      bookingId,
      status: BookingStatus.REFUND_APPROVED,
    });

    await this._notificationService.notify({
      userId: booking.userId,
      type: NotificationType.BOOKING,
      category: NotificationCategory.BOOKING,
      title,
      message,
      socketEvent: SOCKET_EVENTS.REFUND_APPROVED,
      socketPayload: {
        bookingId,
        amount: payment.amount,
        message,
      },
      metadata: { bookingId },
    });

    return updatedBooking;
  }
}
