import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
import { NotificationCategory, NotificationType } from "../../../domain/enum/notificationEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import {
  timeToMinutes,
  toDateString,
} from "../../../utils/schedule/dateHelper";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ICreateBookingUseCase } from "../../interface/booking/ICreateBooking";
import { IScheduleNotificationUseCase } from "../../interface/notification/IScheduleNotificationUseCase";
import { ICreateBookingInput } from "../../interfaceType/booking";
import { ILockSlotService } from "../../serviceInterface/ILockSlotService";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { GetAvailabilityUseCase } from "../beautician/schedule/getAvailableUSeCase";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private bookingRepo: IBookingRepository,
    private bookingHistoryRepo: IBookingHistoryRepository,
    private messageRepo: IMessageRepository,
    private chatRepo: IChatRepository,
    private socketEmitter: ISocketEmitter,
    private getAvailabilityUC: GetAvailabilityUseCase,
    private lockSlotService: ILockSlotService,
    private scheduleNotification: IScheduleNotificationUseCase,

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
      clientNote,
    } = input;

    // ── 1. Chat validation ─────────────────────────────────────────────────
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) throw new AppError("Chat not found.", HttpStatus.NOT_FOUND);
    if (!chat.participants.includes(userId)) {
      throw new AppError("Access denied", HttpStatus.FORBIDDEN);
    }

    // ── 2. Parse slot times ────────────────────────────────────────────────
    // slot.time = "11:00 AM – 01:00 PM"
    const [startStr, endStr] = slot.time.split(" – ");
    if (!startStr || !endStr) {
      throw new AppError("Invalid slot time format", HttpStatus.BAD_REQUEST);
    }

    const startMinutes = timeToMinutes(startStr.trim());
    const endMinutes = timeToMinutes(endStr.trim());

    // ── 3. Validate slot is within beautician availability ─────────────────
    const { availability } = await this.getAvailabilityUC.execute(
      beauticianId,
      new Date(slot.date),
    );

    if (!availability.slots?.length) {
      throw new AppError(
        "Beautician is not available on this date",
        HttpStatus.BAD_REQUEST,
      );
    }

    const fitsInAvailability = availability.slots.some((s) => {
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);
      return startMinutes >= sStart && endMinutes <= sEnd;
    });

    if (!fitsInAvailability) {
      throw new AppError(
        "Requested time is not within available hours",
        HttpStatus.BAD_REQUEST,
      );
    }
    const dateStr = toDateString(slot.date);
    const lockKey = `lock:${beauticianId}:${dateStr}:${startStr.trim()}-${endStr.trim()}`;

    const lockedBy = await this.lockSlotService.get(lockKey);
    console.log("lockKey:", lockKey);
    console.log("lockedBy:", lockedBy);
    console.log("userId:", userId);

    if (!lockedBy || lockedBy !== userId) {
      throw new AppError(
        "Slot reservation expired. Please select the slot again.",
        HttpStatus.CONFLICT,
      );
    }
    // ── 4. Check for overlapping bookings (ACCEPTED or CONFIRMED) ──────────
    const overlapping = await this.bookingRepo.findOverlapping({
      beauticianId,
      date: new Date(slot.date),
      startMinutes,
      endMinutes,
    });

    if (overlapping) {
      throw new AppError(
        "This time slot is already booked",
        HttpStatus.CONFLICT, // ✅ 409 — frontend catches this specifically
      );
    }

    // ── 5. Create booking ──────────────────────────────────────────────────
    const booking = await this.bookingRepo.create({
      chatId,
      userId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot: { ...slot, startMinutes, endMinutes },
      status: BookingStatus.REQUESTED,
      rejectionReason: "",
      cancelledAt: null,
      clientNote: clientNote ?? null,
      beauticianNote: null,
    });

    // ── 6. History ─────────────────────────────────────────────────────────
    await this.bookingHistoryRepo.create({
      bookingId: booking.id,
      action: BookingAction.REQUEST,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: "",
      toStatus: BookingStatus.REQUESTED,
    });

    // ── 7. Chat message ────────────────────────────────────────────────────
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

//     const bookingDate = new Date(slot.date)


//     await this.scheduleNotification.execute({
//   userId,
//   type:     NotificationType.REMINDER,
//   category: NotificationCategory.SYSTEM,
//   title:    'Upcoming Appointment',
//   message:  `Your appointment is tomorrow at ${startStr}`,
//   metadata: { bookingId: booking.id },
//   scheduledFor: new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000),
// })

    // ── 8. Socket ──────────────────────────────────────────────────────────
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
