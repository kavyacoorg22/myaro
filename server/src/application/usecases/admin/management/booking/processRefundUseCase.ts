import { BookingAction, BookingStatus } from "../../../../../domain/enum/bookingEnum";
import { NotificationCategory, NotificationType } from "../../../../../domain/enum/notificationEnum";
import { PaymentStatus, RefundMethod, RefundStatus, RefundType } from "../../../../../domain/enum/paymentEnum";
import { UserRole } from "../../../../../domain/enum/userEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository } from "../../../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IProcessRefundInput, IProcessRefundOutPut } from "../../../../interfaceType/adminType";
import { IPaymentService } from "../../../../serviceInterface/IPaymentServie";
import { BookingHistoryService } from "../../../../services/bookingHistoryService";
import { BookingValidatorService } from "../../../../services/bookingValidatorService";
import { PaymentLookupService } from "../../../../services/paymentLookupService";
import { NotificationDispatchService } from "../../../../services/notificationDispatchService";
import { RazorpayStatusResolverService } from "../../../../services/razorpayStatusResolverService";
import { SOCKET_EVENTS } from "../../../../events/socketEvents";
import { toProcessRefundDto } from "../../../../mapper/adminMapper";
import { IProcessRefundDto } from "../../../../dtos/admin";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";

export class ProcessRefundUseCase {
  constructor(
    private bookingRepo:          IBookingRepository,
    private paymentRepo:          IPaymentRepository,
    private refundRepo:           IRefundRepository,
    private paymentService:       IPaymentService,
    private bookingValidator:     BookingValidatorService,
    private bookingHistory:       BookingHistoryService,
    private paymentLookup:        PaymentLookupService,
    private notificationDispatch: NotificationDispatchService,
    private statusResolver:       RazorpayStatusResolverService,
  ) {}

  async execute(input: IProcessRefundInput): Promise<IProcessRefundOutPut> {
    const { bookingId, adminId, adminNote } = input;

    const booking = await this.bookingValidator.getAndValidateStatusOnly(
      bookingId,
      [BookingStatus.REFUND_APPROVED, BookingStatus.DISPUTE],
    );

    const payment = await this.paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.BEAUTICIAN_APPROVED_REFUND,
      PaymentStatus.REFUND_DISPUTED,
    ]);

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        "Razorpay payment ID missing. Cannot process refund.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ── 3. Find or create refund ───────────────────────────────────────────
    let refund = await this.refundRepo.findByPaymentId(payment.id);

    // ── 4. Idempotency check ───────────────────────────────────────────────
    if (refund?.status === RefundStatus.SUCCESS) {
      throw new AppError("Refund already processed.", HttpStatus.CONFLICT);
    }

    if (!refund) {
      // Dispute path: no refund created yet
      refund = await this.refundRepo.create({
        paymentId:  payment.id,
        amount:     payment.amount,
        method:     RefundMethod.SOURCE,
        status:     RefundStatus.PENDING,
        refundType: RefundType.SERVICE_ISSUE,
        reason:     booking.refundReason ?? undefined,
        adminNote:  adminNote ?? undefined,
      });
    } else {
      refund = await this.refundRepo.updateById(refund.id, {adminNote});
    }

    if (!refund) {
     throw new AppError("Refund not found", HttpStatus.INTERNAL_SERVER_ERROR);
     }
    const razorpayRefund = await this.paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );

    const refundStatus = this.statusResolver.resolveRefundStatus(razorpayRefund.status);

    const updatedRefund = await this.refundRepo.updateStatus(refund?.id, refundStatus);
    if(!updatedRefund)
    {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
    }
    // ── 8. Update payment + booking conditionally ──────────────────────────
    const bookingStatus = refundStatus === RefundStatus.SUCCESS
      ? BookingStatus.CLOSED
      : booking.status; // keep for retry on failure

    if (refundStatus === RefundStatus.SUCCESS) {
      await this.paymentRepo.updateStatus(payment.id, PaymentStatus.REFUNDED);
    }

    const updatedBooking = await this.bookingRepo.updateByBookingId(bookingId, {
      status: bookingStatus,
    });

    if (!updatedBooking) {
      throw new AppError("Failed to update booking.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ── 9. Log history ─────────────────────────────────────────────────────
    await this.bookingHistory.log({
      bookingId,
      action:      BookingAction.PROCESS_REFUND,
      performedBy: adminId,
      role:        UserRole.ADMIN,
      fromStatus:  booking.status,
      toStatus:    bookingStatus,
    });

    // ── 10. Notify customer ────────────────────────────────────────────────
    const customerMessage = refundStatus === RefundStatus.SUCCESS
      ? "Your refund has been processed successfully."
      : "Refund processing failed. Our team will retry shortly.";

    await this.notificationDispatch.notify({
      userId:        booking.userId,
      type:          refundStatus === RefundStatus.SUCCESS
                       ? NotificationType.REFUND_PROCESSED
                       : NotificationType.REFUND_FAILED,
      category:      NotificationCategory.REFUND,
      title:         "Refund Update",
      message:       customerMessage,
      socketEvent:   SOCKET_EVENTS.REFUND_PROCESSED,
      socketPayload: { bookingId, amount: payment.amount, status: refundStatus },
      metadata:      { bookingId, paymentId: payment.id, refundId: updatedRefund.id },
    });

    // ── 11. Notify beautician ──────────────────────────────────────────────
    const beauticianMessage = refundStatus === RefundStatus.SUCCESS
      ? `Refund of ₹${payment.amount} was issued to the customer. Reason: ${adminNote ?? "No reason provided."}`
      : `Refund attempt failed. Admin will retry.`;

    await this.notificationDispatch.notify({
      userId:        booking.beauticianId,
      type:          refundStatus === RefundStatus.SUCCESS
                       ? NotificationType.DISPUTE_RESOLVED
                       : NotificationType.REFUND_FAILED,
      category:      NotificationCategory.DISPUTE,
      title:         "Dispute Resolved",
      message:       beauticianMessage,
      socketEvent:   SOCKET_EVENTS.DISPUTE_RESOLVED,
      socketPayload: { bookingId, message: beauticianMessage },
      metadata:      { bookingId, paymentId: payment.id },
    });

    const data= toProcessRefundDto({ refund: updatedRefund, payment });
    return {data}
  }
}