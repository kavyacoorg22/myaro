import { Booking } from "../../../domain/entities/booking";
import { BookingStatus } from "../../../domain/enum/bookingEnum"; // ✅ add import
import { MessageType } from "../../../domain/enum/messageEnum";
import { NotificationCategory, NotificationType } from "../../../domain/enum/notificationEnum";
import { PaymentStatus } from "../../../domain/enum/paymentEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository"; // ✅ use interface
import { ACTION_MESSAGE, ACTION_TO_STATUS, VALID_TRANSITIONS } from "../../../domain/services/bookingStatusMachine";
import { bookingMessages } from "../../../shared/constant/message/bookingMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IUpdateBookingStatusUseCase } from "../../interface/booking/IUpdateBookingStatusUSeCase";
import { IUpdateBookingStatusInput } from "../../interfaceType/booking";
import { ChatMessageService } from "../../services/chatMessageService";
import { NotificationDispatchService } from "../../services/notificationDispatchService";

export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase {
  constructor(
    private _bookingRepo:        IBookingRepository,
    private _bookingHistoryRepo: IBookingHistoryRepository,
    private _paymentRepo:        IPaymentRepository, 
    private _notificationService:NotificationDispatchService,
    private _chatMessageService:ChatMessageService
  ) {}

  async execute(input: IUpdateBookingStatusInput): Promise<Booking | null> {
    const { bookingId, performedBy, role, action, rejectionReason, beauticianNote } = input;

    // 1. find booking
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) throw new AppError(bookingMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    // 2. validate transition
    const allowedActions = VALID_TRANSITIONS[booking.status];
   if (!allowedActions.includes(action)) {
      throw new AppError(
        bookingMessages.ERROR.INVALID_TRANSITION(action, booking.status),
        HttpStatus.BAD_REQUEST,
      );
    }

    const fromStatus = booking.status;
    const toStatus   = ACTION_TO_STATUS[action];

    // 3. update booking status
    const updated = await this._bookingRepo.updateStatus(
      bookingId,
      toStatus,
      rejectionReason,
      beauticianNote,
    );

    // 4. record history
    await this._bookingHistoryRepo.create({
      bookingId,
      action,
      performedBy,
      role,
      fromStatus,
      toStatus,
    });

if (toStatus === BookingStatus.COMPLETED) {
  const payment = await this._paymentRepo.findByBookingId(bookingId);
  if (payment && payment.status !== PaymentStatus.READY_TO_RELEASE) {
    await this._paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.READY_TO_RELEASE, 
    );
  }
}

    // 6. determine receiver
    const receiverId = performedBy === booking.userId
      ? booking.beauticianId
      : booking.userId;

    // 7. send booking status message to chat
    const message = rejectionReason
      ? `${ACTION_MESSAGE[action]}: ${rejectionReason}`
      : ACTION_MESSAGE[action];
//create + send message
      await this._chatMessageService.sendAndEmit({
      chatId:     booking.chatId,
      senderId:   performedBy,
      receiverId,
      message,
      type:       MessageType.BOOKING,
      bookingId:  booking.id,
      status:     toStatus,
    });
//notify
  await this._notificationService.notify({
      userId:        receiverId,
      type:          NotificationType.BOOKING,
      category:      NotificationCategory.BOOKING,
      title:         ACTION_MESSAGE[action],
      message,
      socketEvent:   SOCKET_EVENTS.NEW_NOTIFICATION,
      socketPayload: { chatId: booking.chatId, lastMessage: message, lastMessageAt: new Date() },
      metadata:      { bookingId: booking.id },
    });

    return updated;
  }
}