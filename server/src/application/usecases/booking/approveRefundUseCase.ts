import { Booking } from "../../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { PaymentStatus, RefundMethod, RefundStatus, RefundType } from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";
import { BookingHistoryService } from "../../services/bookingHistoryService";
import { BookingValidatorService } from "../../services/bookingValidatorService";
import { PaymentLookupService } from "../../services/paymentLookupService";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { IApproveRefundUseCase } from "../../interface/booking/IApproveRefundUseCase";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository } from "../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { IApproveRefundUInput } from "../../interfaceType/booking";

export class ApproveRefundUseCase implements IApproveRefundUseCase {
  constructor(
    private bookingRepo:      IBookingRepository,
    private paymentRepo:      IPaymentRepository,
    private refundRepo:       IRefundRepository,
    private paymentService:   IPaymentService,      
    private socketEmitter:    ISocketEmitter,
    private bookingValidator: BookingValidatorService,
    private bookingHistory:   BookingHistoryService,
    private paymentLookup:    PaymentLookupService,
  ) {}

  async execute(input: IApproveRefundUInput): Promise<Booking> {
    const { bookingId, beauticianId } = input;

    const booking = await this.bookingValidator.getAndValidateStatus(
      bookingId,
      beauticianId,
      "beauticianId",
      [BookingStatus.REFUND_REQUESTED],
    );

    const payment = await this.paymentLookup.getAndValidateStatus(
      bookingId,
      [PaymentStatus.REFUND_REQUESTED],
    );

    if (!payment.razorpayPaymentId) {
      throw new AppError("Razorpay payment ID missing", HttpStatus.BAD_REQUEST);
    }

    const razorpayRefund = await this.paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );


    await this.refundRepo.create({
      paymentId:        payment.id,
      amount:           payment.amount,
      method:           RefundMethod.SOURCE,
      status:           RefundStatus.PENDING,
      refundType:       RefundType.SERVICE_ISSUE,
      razorpayRefundId: razorpayRefund.id,
      reason:           booking.refundReason ?? undefined,
    });

    await this.paymentRepo.updateStatus(
      payment.id,
      PaymentStatus.BEAUTICIAN_APPROVED_REFUND,
    );

    const updatedBooking = await this.bookingRepo.updateByBookingId(bookingId, {
      status: BookingStatus.REFUND_REQUESTED,   
    });

    if (!updatedBooking) {
      throw new AppError("Failed to update booking", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ── 7. Log history ─────────────────────────────────────────────────────
    await this.bookingHistory.log({
      bookingId,
      action:      BookingAction.APPROVE_REFUND,
      performedBy: beauticianId,
      role:        UserRole.BEAUTICIAN,
      fromStatus:  BookingStatus.REFUND_REQUESTED,
      toStatus:    BookingStatus.REFUND_REQUESTED,
    });

    // ── 8. Notify customer ─────────────────────────────────────────────────
    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.REFUND_APPROVED,
      {
        bookingId,
        amount:           payment.amount,
        razorpayRefundId: razorpayRefund.id,
        message:          "Your refund has been approved. Amount will be credited in 5–7 business days.",
      },
    );

    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        chatId:        booking.chatId,
        lastMessage:   "Your refund has been approved",
        lastMessageAt: new Date(),
        type:          "refund_approved",
      },
    );

    return updatedBooking;
  }
}