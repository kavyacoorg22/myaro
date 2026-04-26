import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
import { PaymentStatus, RefundType } from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { BookingValidatorService } from "../../services/bookingValidatorService";
import { ChatMessageService } from "../../services/chatMessageService";
import { PaymentLookupService } from "../../services/paymentLookupService";
import { IRequestRefundUseCase } from "../../interface/booking/IRequestRefundUC";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRequestRefundInput } from "../../interfaceType/booking";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";
import { NotificationDispatchService } from "../../services/notificationDispatchService";
import { userMessages } from "../../../shared/constant/message/userMessage";

export class RequestRefundUseCase implements IRequestRefundUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _bookingValidator: BookingValidatorService,
    private _bookingHistory: BookingHistoryService,
    private _chatMessage: ChatMessageService,
    private _paymentLookup: PaymentLookupService,
    private _notificationService: NotificationDispatchService,
  ) {}

  async execute(input: IRequestRefundInput): Promise<Booking> {
    const { bookingId, userId, refundReason } = input;

    const booking = await this._bookingValidator.getAndValidateStatus(
      bookingId,
      userId,
      "userId",
      [BookingStatus.CONFIRMED],
    );

    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.PAID,
    ]);

    // ── 3. Update booking ──────────────────────────────────────────────────
    const updatedBooking = await this._bookingRepo.updateByBookingId(
      bookingId,
      {
        status: BookingStatus.REFUND_REQUESTED,
        refundReason,
        refundType: RefundType.SERVICE_ISSUE,
      },
    );

    if (!updatedBooking) {
      throw new AppError(
        userMessages.ERROR.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ── 4. Update payment ──────────────────────────────────────────────────
    await this._paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.REFUND_REQUESTED,
      {
        refundReason,
      },
    );

    // ── 5. Log history ─────────────────────────────────────────────────────
    await this._bookingHistory.log({
      bookingId,
      action: BookingAction.REQUEST_REFUND,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: BookingStatus.CONFIRMED,
      toStatus: BookingStatus.REFUND_REQUESTED,
    });
    const chatMsg = CHAT_ACTION_MESSAGE[BookingAction.REQUEST_REFUND];
    const message = ACTION_MESSAGE[BookingAction.REQUEST_REFUND];
    const title = ACTION_TITLE[BookingAction.REQUEST_REFUND];
    // ── 6. Send chat message + notify ─────────────────────────────────────
    await this._chatMessage.sendAndEmit({
      chatId: booking.chatId,
      senderId: userId,
      receiverId: booking.beauticianId,
      message: `${chatMsg}: ${refundReason}`,
      type: MessageType.BOOKING,
      bookingId,
      status: BookingStatus.REFUND_REQUESTED,
    });

    // ── 7. Extra socket event for beautician's refund card ─────────────────
    await this._notificationService.notify({
      userId: booking.beauticianId,
      type: NotificationType.BOOKING,
      category: NotificationCategory.BOOKING,
      title,
      message,
      socketEvent: SOCKET_EVENTS.NEW_NOTIFICATION,
      socketPayload: {
        chatId: booking.chatId,
        message,
        lastMessageAt: new Date(),
      },
      metadata: { bookingId: booking.id },
    });

    return updatedBooking;
  }
}
