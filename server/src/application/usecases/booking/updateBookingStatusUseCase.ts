import { Booking } from "../../../domain/entities/booking";
import { MessageType } from "../../../domain/enum/messageEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { ACTION_MESSAGE, ACTION_TO_STATUS, VALID_TRANSITIONS } from "../../../domain/services/bookingStatusMachine";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IUpdateBookingStatusUseCase } from "../../interface/booking/IUpdateBookingStatusUSeCase";
import { IUpdateBookingStatusInput } from "../../interfaceType/booking";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";


export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase{
   constructor(
    private bookingRepo:        IBookingRepository,
    private bookingHistoryRepo: IBookingHistoryRepository,
    private messageRepo:        IMessageRepository,
    private chatRepo:           IChatRepository
    ,
    private socketEmitter:      ISocketEmitter,
  ) {}

  async execute(input: IUpdateBookingStatusInput): Promise<Booking|null> {
    const { bookingId, performedBy, role, action, rejectionReason } = input;

    const booking = await this.bookingRepo.findById(bookingId);
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
    const updated = await this.bookingRepo.updateStatus(
      bookingId,
      toStatus,
      rejectionReason,
    );

    // 4. record history
    await this.bookingHistoryRepo.create({
      bookingId,
      action,
      performedBy,
      role,
      fromStatus,
      toStatus,
    });

    // 5. determine receiver — opposite of who performed the action
    const receiverId = performedBy === booking.userId
      ? booking.beauticianId
      : booking.userId;

    // 6. send booking status message to chat
    const message = rejectionReason
      ? `${ACTION_MESSAGE[action]}: ${rejectionReason}`
      : ACTION_MESSAGE[action];

    const saved = await this.messageRepo.create({
      chatId:     booking.chatId,
      senderId:   performedBy,
      receiverId,
      message,
      type:       MessageType.BOOKING,
      bookingId:  booking.id,
      status:toStatus,
      seen:       false,
    });

    // 7. update chat last message
    await this.chatRepo.updateLastMessage(booking.chatId, message, saved.createdAt);

    // 8. emit to chat room — both see updated booking card
    this.socketEmitter.emitToRoom(
      booking.chatId,
      SOCKET_EVENTS.NEW_MESSAGE,
      saved,
    );

    // 9. notify receiver's personal room
    this.socketEmitter.emitToRoom(
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