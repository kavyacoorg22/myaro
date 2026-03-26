import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ICreateBookingUseCase } from "../../interface/booking/ICreateBooking";
import { ICreateBookingInput } from "../../interfaceType/booking";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private bookingRepo: IBookingRepository,
    private bookingHistoryRepo: IBookingHistoryRepository,
    private messageRepo: IMessageRepository,
    private chatRepo: IChatRepository,
    private socketEmitter: ISocketEmitter,
  ) {}

  async execute(input: ICreateBookingInput): Promise<Booking> {
    const {
      chatId,
      userId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot,
    } = input;

    const chat = await this.chatRepo.findById(chatId);
    if (!chat) throw new AppError(`Chat not found.`, HttpStatus.NOT_FOUND);

    if (!chat.participants.includes(userId)) {
      throw new AppError("Access denied", HttpStatus.FORBIDDEN);
    }

    const booking = await this.bookingRepo.create({
      chatId,
      userId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot,
      status: BookingStatus.REQUESTED,
      rejectionReason: "",
      cancelledAt: null,
    });

    await this.bookingHistoryRepo.create({
      bookingId: booking.id,
      action: BookingAction.REQUEST,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: "",
      toStatus: BookingStatus.REQUESTED,
    });

    const saved = await this.messageRepo.create({
      chatId,
      senderId: userId,
      receiverId: beauticianId,
      message: `Booking request for ${services.map((s) => s.name).join(", ")}`,
      type: MessageType.BOOKING,
      bookingId: booking.id,
      seen: false,
    });

  
    await this.chatRepo.updateLastMessage(
      chatId,
      saved.message,
      saved.createdAt,
    );

    this.socketEmitter.emitToRoom(chatId, SOCKET_EVENTS.NEW_MESSAGE, saved);

    this.socketEmitter.emitToRoom(
      `user:${beauticianId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        chatId,
        lastMessage: saved.message,
        lastMessageAt: saved.createdAt,
      },
    );

    return booking;
  }
}
