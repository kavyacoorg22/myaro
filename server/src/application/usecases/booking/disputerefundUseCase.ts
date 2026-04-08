// usecases/booking/disputeRefundUseCase.ts
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

export class DisputeRefundUseCase implements IDisputeRefundUseCase {
  constructor(
    private bookingRepo:      IBookingRepository,
    private paymentRepo:      IPaymentRepository,
    private socketEmitter:    ISocketEmitter,
    private bookingValidator: BookingValidatorService,
    private bookingHistory:   BookingHistoryService,
    private paymentLookup:    PaymentLookupService,
    private chatMessage:      ChatMessageService,
  ) {}

  async execute(input: IDisputeRefundUInput): Promise<Booking> {
    const { bookingId, beauticianId, disputeReason } = input;

    // 1. Validate booking is in REFUND_REQUESTED state
    const booking = await this.bookingValidator.getAndValidateStatus(
      bookingId,
      beauticianId,
      "beauticianId",
      [BookingStatus.REFUND_REQUESTED],
    );

    // 2. Validate payment is in REFUND_REQUESTED state
    const payment = await this.paymentLookup.getAndValidateStatus(
      bookingId,
      [PaymentStatus.REFUND_REQUESTED],
    );

    // 3. Update booking → DISPUTE, store beautician's reason
    const updatedBooking = await this.bookingRepo.updateByBookingId(bookingId, {
      status:        BookingStatus.DISPUTE,
      disputeReason,
      disputeAt:     new Date(),
    });

    if (!updatedBooking) {
      throw new AppError("Failed to update booking", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 4. Update payment → REFUND_DISPUTED (admin will arbitrate)
    await this.paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.REFUND_DISPUTED,
    );

    // 5. Log history
    await this.bookingHistory.log({
      bookingId,
      action:      BookingAction.DISPUTE,        // add to your enum if missing
      performedBy: beauticianId,
      role:        UserRole.BEAUTICIAN,
      fromStatus:  BookingStatus.REFUND_REQUESTED,
      toStatus:    BookingStatus.DISPUTE,
    });

    // 6. Notify customer via chat
    await this.chatMessage.sendAndEmit({
      chatId:     booking.chatId,
      senderId:   beauticianId,
      receiverId: booking.userId,
      message:    `Your refund request is under dispute: "${disputeReason}"`,
      type:       MessageType.BOOKING,
      bookingId,
      status:     BookingStatus.DISPUTE,
    });

    // 7. Notify customer via socket
    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.REFUND_DISPUTED,        // add to your SOCKET_EVENTS if missing
      {
        bookingId,
        disputeReason,
        message: "The beautician has disputed your refund. Admin will review.",
      },
    );

    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        chatId:        booking.chatId,
        lastMessage:   "Your refund request is under dispute",
        lastMessageAt: new Date(),
        type:          "refund_disputed",
      },
    );

    return updatedBooking;
  }
}