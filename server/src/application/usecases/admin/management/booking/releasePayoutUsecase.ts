import { BookingAction, BookingStatus } from "../../../../../domain/enum/bookingEnum";
import { NotificationCategory, NotificationType } from "../../../../../domain/enum/notificationEnum";
import { PaymentStatus, PayoutStatus } from "../../../../../domain/enum/paymentEnum";
import { UserRole } from "../../../../../domain/enum/userEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IReleasePayoutInput, IReleasePayoutOutPut } from "../../../../interfaceType/adminType";
import { IPaymentService } from "../../../../serviceInterface/IPaymentServie";
import { BookingHistoryService } from "../../../../services/bookingHistoryService";
import { BookingValidatorService } from "../../../../services/bookingValidatorService";
import { PaymentLookupService } from "../../../../services/paymentLookupService";
import { NotificationDispatchService } from "../../../../services/notificationDispatchService";
import { RazorpayStatusResolverService } from "../../../../services/razorpayStatusResolverService";
import { SOCKET_EVENTS } from "../../../../events/socketEvents";
import { toReleasePayoutDto } from "../../../../mapper/adminMapper";
import { IPayoutRepository } from "../../../../../domain/repositoryInterface/User/admin/IPayoutRepository";
import { IReleasePayoutUSeCase } from "../../../../interface/admin/management/booking/IReleasePayoutUsecase";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";

export class ReleasePayoutUseCase implements IReleasePayoutUSeCase {
  constructor(
    private _bookingRepo:          IBookingRepository,
    private _paymentRepo:          IPaymentRepository,
    private _payoutRepo:           IPayoutRepository,
    private _paymentService:       IPaymentService,
    private _bookingValidator:     BookingValidatorService,
    private _bookingHistory:       BookingHistoryService,
    private _paymentLookup:        PaymentLookupService,
    private _notificationDispatch: NotificationDispatchService,
    private _statusResolver:       RazorpayStatusResolverService,
    private _Beauticianrepo:IBeauticianRepository
  ) {}

  async execute(input: IReleasePayoutInput): Promise<IReleasePayoutOutPut> {
    const { bookingId, adminId, adminNote } = input;


    const booking = await this._bookingValidator.getAndValidateStatusOnly(
      bookingId,
      [BookingStatus.COMPLETED, BookingStatus.DISPUTE],
    );

    const isDispute = booking.status === BookingStatus.DISPUTE;

    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.PAID,
      PaymentStatus.REFUND_DISPUTED,
    ]);

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        "Razorpay payment ID missing. Cannot release payout.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ── 3. Idempotency check ───────────────────────────────────────────────
    const existingPayout = await this._payoutRepo.findByPaymentId(payment.id);
    if (existingPayout?.status === PayoutStatus.COMPLETED) {
      throw new AppError("Payout already completed.", HttpStatus.CONFLICT);
    }

    // ── 4. Create payout record ────────────────────────────────────────────
    const payout = await this._payoutRepo.create({
      paymentId:    payment.id,
      customerId:   booking.userId,
      beauticianId: booking.beauticianId,
      amount:       payment.amount,
      status:       PayoutStatus.PENDING,
      adminNote:    adminNote ?? undefined,
    });

    // ── 5. Call Razorpay payout ────────────────────────────────────────────
    const razorpayPayout = await this._paymentService.releasePayout(
      booking.beauticianId,
      payment.amount,
    );

    // ── 6. Resolve status ──────────────────────────────────────────────────
    const payoutStatus = this._statusResolver.resolvePayoutStatus(razorpayPayout.status);

    // ── 7. Update payout ───────────────────────────────────────────────────
    const updatedPayout = await this._payoutRepo.updateStatus(payout.id, payoutStatus);

    // ── 8. Update payment + booking conditionally ──────────────────────────
    const bookingStatus = payoutStatus === PayoutStatus.COMPLETED
      ? BookingStatus.CLOSED
      : booking.status; 

    if (payoutStatus === PayoutStatus.COMPLETED) {
      await this._paymentRepo.updateStatus(payment.id, PaymentStatus.RELEASED);
    }

    const updatedBooking = await this._bookingRepo.updateByBookingId(bookingId, {
      status: bookingStatus,
    });
 
    if (!updatedBooking) {
      throw new AppError("Failed to update booking.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this._Beauticianrepo.incrementHomeServiceCount(payout.beauticianId)
    // ── 9. Log history ─────────────────────────────────────────────────────
    await this._bookingHistory.log({
      bookingId,
      action:      BookingAction.RELEASE_PAYOUT,
      performedBy: adminId,
      role:        UserRole.ADMIN,
      fromStatus:  booking.status,
      toStatus:    bookingStatus,
    });

    // ── 10. Notify beautician ──────────────────────────────────────────────
    const beauticianMessage = payoutStatus === PayoutStatus.COMPLETED
      ? isDispute
        ? `₹${payment.amount} has been credited to your account. Dispute resolved in your favour.`
        : `₹${payment.amount} has been credited to your account.`
      : `Payout attempt failed. Admin will retry shortly.`;

    await this._notificationDispatch.notify({
      userId:        booking.beauticianId,
      type:          payoutStatus === PayoutStatus.COMPLETED
                       ? NotificationType.DISPUTE_RESOLVED
                       : NotificationType.REFUND_FAILED,
      category:      NotificationCategory.DISPUTE,
      title:         isDispute ? "Dispute Resolved" : "Payment Released",
      message:       beauticianMessage,
      socketEvent:   SOCKET_EVENTS.PAYOUT_RELEASED,
      socketPayload: { bookingId, amount: payment.amount, status: payoutStatus },
      metadata:      { bookingId, paymentId: payment.id },
    });

    // ── 11. Notify customer (only in dispute case) ─────────────────────────
    // Normal completion → customer already knows, no need to notify
    if (isDispute) {
      const customerMessage = payoutStatus === PayoutStatus.COMPLETED
        ? `Your dispute was reviewed. Amount released to beautician. Reason: ${adminNote ?? "No reason provided."}`
        : `Dispute is still under review. We will update you shortly.`;

      await this._notificationDispatch.notify({
        userId:        booking.userId,
        type:          payoutStatus === PayoutStatus.COMPLETED
                         ? NotificationType.DISPUTE_RESOLVED
                         : NotificationType.DISPUTE_CREATED,
        category:      NotificationCategory.DISPUTE,
        title:         "Dispute Update",
        message:       customerMessage,
        socketEvent:   SOCKET_EVENTS.DISPUTE_RESOLVED,
        socketPayload: { bookingId, message: customerMessage },
        metadata:      { bookingId, paymentId: payment.id },
      });
    }

    const data=toReleasePayoutDto({ payout: updatedPayout, payment });
    return {data}
  }
}