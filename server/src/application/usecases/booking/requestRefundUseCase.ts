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
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { IRequestRefundUseCase } from "../../interface/booking/IRequestRefundUC";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRequestRefundInput } from "../../interfaceType/booking";

export class RequestRefundUseCase implements IRequestRefundUseCase {
  constructor(
    private bookingRepo:      IBookingRepository,
    private paymentRepo:      IPaymentRepository,
    private socketEmitter:    ISocketEmitter,
    private bookingValidator: BookingValidatorService,
    private bookingHistory:   BookingHistoryService,
    private chatMessage:      ChatMessageService,
    private paymentLookup:    PaymentLookupService,
  ) {}

  async execute(input: IRequestRefundInput): Promise<Booking> {
    const { bookingId, userId, refundReason} = input;

    const booking = await this.bookingValidator.getAndValidateStatus(
      bookingId,
      userId,
      "userId",
      [BookingStatus.CONFIRMED],
    );

    const payment = await this.paymentLookup.getAndValidateStatus(
      bookingId,
      [PaymentStatus.PAID],
    );

    // ── 3. Update booking ──────────────────────────────────────────────────
    const updatedBooking = await this.bookingRepo.updateByBookingId(bookingId, {
      status:     BookingStatus.REFUND_REQUESTED,
      refundReason,
      refundType: RefundType.SERVICE_ISSUE,
    });

    if (!updatedBooking) {
      throw new AppError("Failed to update booking", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ── 4. Update payment ──────────────────────────────────────────────────
    await this.paymentRepo.updateStatus(payment.id, PaymentStatus.REFUND_REQUESTED, {
      refundReason,
    });

    // ── 5. Log history ─────────────────────────────────────────────────────
    await this.bookingHistory.log({
      bookingId,
      action:      BookingAction.REQUEST_REFUND,
      performedBy: userId,
      role:        UserRole.CUSTOMER,
      fromStatus:  BookingStatus.CONFIRMED,
      toStatus:    BookingStatus.REFUND_REQUESTED,
    });

    // ── 6. Send chat message + notify ─────────────────────────────────────
    await this.chatMessage.sendAndEmit({
      chatId:     booking.chatId,
      senderId:   userId,
      receiverId: booking.beauticianId,
      message:    `Refund requested: ${refundReason}`,
      type:       MessageType.BOOKING,
      bookingId,
      status:BookingStatus.REFUND_REQUESTED
    });

    // ── 7. Extra socket event for beautician's refund card ─────────────────
    this.socketEmitter.emitToRoom(
      `user:${booking.beauticianId}`,
      SOCKET_EVENTS.REFUND_REQUESTED,
      {
        bookingId,
        chatId:      booking.chatId,
        refundReason,
        amount:      payment.amount,
        serviceDate: booking.slot.date,
      },
    );

    return updatedBooking;
  }
}