import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { MessageType } from "../../../domain/enum/messageEnum";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";

import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import {
  timeToMinutes,
  toDateString,
} from "../../../utils/schedule/dateHelper";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ICreateBookingUseCase } from "../../interface/booking/ICreateBooking";
import { ICreateBookingInput } from "../../interfaceType/booking";
import { ILockSlotService } from "../../serviceInterface/ILockSlotService";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { ChatMessageService } from "../../services/chatMessageService";
import { NotificationDispatchService } from "../../services/notificationDispatchService";
import { GetAvailabilityUseCase } from "../beautician/schedule/getAvailableUSeCase";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _chatRepo: IChatRepository,
    private _getAvailabilityUC: GetAvailabilityUseCase,
    private _lockSlotService: ILockSlotService,
    private _chatMessage: ChatMessageService,
    private _notificationService: NotificationDispatchService,
    private _bookingHistory: BookingHistoryService,
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
    const chat = await this._chatRepo.findById(chatId);
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
    const { availability } = await this._getAvailabilityUC.execute(
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

    const lockedBy = await this._lockSlotService.get(lockKey);

    if (!lockedBy || lockedBy !== userId) {
      throw new AppError(
        "Slot reservation expired. Please select the slot again.",
        HttpStatus.CONFLICT,
      );
    }
    // ── 4. Check for overlapping bookings (ACCEPTED or CONFIRMED) ──────────
    const overlapping = await this._bookingRepo.findOverlapping({
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
    const booking = await this._bookingRepo.create({
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
    await this._bookingHistory.log({
      bookingId: booking.id,
      action: BookingAction.REQUEST,
      performedBy: userId,
      role: UserRole.CUSTOMER,
      fromStatus: "",
      toStatus: BookingStatus.REQUESTED,
    });

    // ── 7. Chat message ────────────────────────────────────────────────────
    const chatMsg = CHAT_ACTION_MESSAGE[BookingAction.REQUEST];
    const message = ACTION_MESSAGE[BookingAction.REQUEST];
    const title = ACTION_TITLE[BookingAction.REQUEST];

    await this._chatMessage.sendAndEmit({
      chatId,
      senderId: userId,
      receiverId: beauticianId,
      message: chatMsg,
      type: MessageType.BOOKING,
      bookingId: booking.id,
      status: BookingStatus.REQUESTED,
    });

    await this._notificationService.notify({
      userId: beauticianId,
      type: NotificationType.BOOKING,
      category: NotificationCategory.BOOKING,
      title,
      message,
      socketEvent: SOCKET_EVENTS.NEW_NOTIFICATION,
      socketPayload: { chatId, message, lastMessageAt: new Date() },
      metadata: { bookingId: booking.id },
    });

    return booking;
  }
}
