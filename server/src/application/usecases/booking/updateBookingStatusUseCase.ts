import { Booking } from "../../../domain/entities/booking";
import { BookingStatus } from "../../../domain/enum/bookingEnum"; // ✅ add import
import { MessageType } from "../../../domain/enum/messageEnum";
import { PaymentStatus } from "../../../domain/enum/paymentEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository"; // ✅ use interface
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { ACTION_MESSAGE, ACTION_TO_STATUS, VALID_TRANSITIONS } from "../../../domain/services/bookingStatusMachine";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IUpdateBookingStatusUseCase } from "../../interface/booking/IUpdateBookingStatusUSeCase";
import { IUpdateBookingStatusInput } from "../../interfaceType/booking";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";

export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase {
  constructor(
    private _bookingRepo:        IBookingRepository,
    private _bookingHistoryRepo: IBookingHistoryRepository,
    private _messageRepo:        IMessageRepository,
    private _chatRepo:           IChatRepository,
    private _socketEmitter:      ISocketEmitter,
    private _paymentRepo:        IPaymentRepository, 
  ) {}

  async execute(input: IUpdateBookingStatusInput): Promise<Booking | null> {
    const { bookingId, performedBy, role, action, rejectionReason, beauticianNote } = input;

    // 1. find booking
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) throw new AppError("Booking not found.", HttpStatus.NOT_FOUND);

    // 2. validate transition
    const allowedActions = VALID_TRANSITIONS[booking.status];
    if (!allowedActions.includes(action)) {
      throw new AppError(
        `Cannot ${action} a booking that is ${booking.status}.`,
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

    const saved = await this._messageRepo.create({
      chatId:     booking.chatId,
      senderId:   performedBy,
      receiverId,
      message,
      type:       MessageType.BOOKING,
      bookingId:  booking.id,
      status:     toStatus,
      seen:       false,
    });

    // 8. update chat last message
    await this._chatRepo.updateLastMessage(booking.chatId, message, saved.createdAt);

    // 9. emit new message to chat room
    this._socketEmitter.emitToRoom(
      booking.chatId,
      SOCKET_EVENTS.NEW_MESSAGE,
      saved,
    );

    // 10. notify receiver
    this._socketEmitter.emitToRoom(
      `user:${receiverId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        chatId:        booking.chatId,
        lastMessage:   message,
        lastMessageAt: saved.createdAt,
      },
    );

    return updated;
  }
}