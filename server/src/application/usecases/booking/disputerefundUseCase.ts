import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { PaymentStatus } from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { BookingValidatorService } from "../../services/bookingValidatorService";
import { PaymentLookupService } from "../../services/paymentLookupService";
import { ChatMessageService } from "../../services/chatMessageService";
import { MessageType } from "../../../domain/enum/messageEnum";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IDisputeRefundUInput } from "../../interfaceType/booking";
import { IDisputeRefundUseCase } from "../../interface/booking/IDisputeRefundUsecase";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import { NotificationDispatchService } from "../../services/notificationDispatchService";

export class DisputeRefundUseCase implements IDisputeRefundUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _bookingValidator: BookingValidatorService,
    private _bookingHistory: BookingHistoryService,
    private _paymentLookup: PaymentLookupService,
    private _chatMessage: ChatMessageService,
    private _notificationService: NotificationDispatchService,
  ) {}

  async execute(input: IDisputeRefundUInput): Promise<Booking> {
    const { bookingId, beauticianId, disputeReason } = input;

    // 1. Validate booking is in REFUND_REQUESTED state
    const booking = await this._bookingValidator.getAndValidateStatus(
      bookingId,
      beauticianId,
      "beauticianId",
      [BookingStatus.REFUND_REQUESTED],
    );

    // 2. Validate payment is in REFUND_REQUESTED state
    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.REFUND_REQUESTED,
    ]);

    // 3. Update booking → DISPUTE, store beautician's reason
    const updatedBooking = await this._bookingRepo.updateByBookingId(
      bookingId,
      {
        status: BookingStatus.DISPUTE,
        disputeReason,
        disputeAt: new Date(),
      },
    );

    if (!updatedBooking) {
      throw new AppError(
        "Failed to update booking",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 4. Update payment → REFUND_DISPUTED (admin will arbitrate)
    await this._paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.REFUND_DISPUTED,
    );

    // 5. Log history
    await this._bookingHistory.log({
      bookingId,
      action: BookingAction.DISPUTE,
      performedBy: beauticianId,
      role: UserRole.BEAUTICIAN,
      fromStatus: BookingStatus.REFUND_REQUESTED,
      toStatus: BookingStatus.DISPUTE,
    });
    const chatMsg = CHAT_ACTION_MESSAGE[BookingAction.DISPUTE];
    const message = ACTION_MESSAGE[BookingAction.DISPUTE];
    const title = ACTION_TITLE[BookingAction.DISPUTE];

    // 6. Notify customer via chat
    await this._chatMessage.sendAndEmit({
      chatId: booking.chatId,
      senderId: beauticianId,
      receiverId: booking.userId,
      message: chatMsg,
      type: MessageType.BOOKING,
      bookingId,
      status: BookingStatus.DISPUTE,
    });

    await this._notificationService.notify({
      userId: booking.chatId,
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
