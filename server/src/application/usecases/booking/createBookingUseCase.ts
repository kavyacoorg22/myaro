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
import { ICommentRepository } from "../../../domain/repositoryInterface/User/ICommetRepository";
import {
  ACTION_MESSAGE,
  ACTION_TITLE,
  CHAT_ACTION_MESSAGE,
} from "../../../domain/services/bookingStatusMachine";
import { beauticianMessages } from "../../../shared/constant/message/beauticianMessage";
import { chatMessages } from "../../../shared/constant/message/chatMessage";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { scheduleMessages } from "../../../shared/constant/message/scheduleMessage";
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
    private _commentRepo:ICommentRepository
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
    if (!chat)
      throw new AppError(chatMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    if (!chat.participants.includes(userId)) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    // ── 2. Parse slot times ────────────────────────────────────────────────
    // slot.time = "11:00 AM – 01:00 PM"
    const [startStr, endStr] = slot.time.split(" – ");
    if (!startStr || !endStr) {
      throw new AppError(
        scheduleMessages.ERROR.INVALID_SLOT_TIME_FORMAT,
        HttpStatus.BAD_REQUEST,
      );
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
        beauticianMessages.ERROR.BEAUTICIAN_NOT_AVAILABLE_ON_DATE,
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
        beauticianMessages.ERROR.REQUESTED_TIME_NOT_AVAILABLE,
        HttpStatus.BAD_REQUEST,
      );
    }
    const dateStr = toDateString(slot.date);
    const lockKey = `lock:${beauticianId}:${dateStr}:${startStr.trim()}-${endStr.trim()}`;

    const lockedBy = await this._lockSlotService.get(lockKey);

    if (!lockedBy || lockedBy !== userId) {
      throw new AppError(
        scheduleMessages.ERROR.SLOT_RESERVATION_EXPIRED,
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
        scheduleMessages.ERROR.SLOT_ALREADY_BOOKED,
        HttpStatus.CONFLICT,
      );
    }

   const isCancelled=await this._bookingRepo.checkPremiumUser(userId)

   const {avgRating,totalReviews}=await this._commentRepo.getRatingSummary(beauticianId)

   if(!isCancelled && avgRating>4)

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
