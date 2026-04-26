import {
  BookingAction,
  BookingStatus,
} from "../../../../../domain/enum/bookingEnum";
import {
  NotificationCategory,
  NotificationType,
} from "../../../../../domain/enum/notificationEnum";
import {
  PaymentStatus,
  RefundMethod,
  RefundStatus,
  RefundType,
} from "../../../../../domain/enum/paymentEnum";
import { UserRole } from "../../../../../domain/enum/userEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository } from "../../../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import {
  IProcessRefundInput,
  IProcessRefundOutPut,
} from "../../../../interfaceType/adminType";
import { IPaymentService } from "../../../../serviceInterface/IPaymentServie";
import { BookingHistoryService } from "../../../../services/bookingHistoryService";
import { BookingValidatorService } from "../../../../services/bookingValidatorService";
import { PaymentLookupService } from "../../../../services/paymentLookupService";
import { NotificationDispatchService } from "../../../../services/notificationDispatchService";
import { RazorpayStatusResolverService } from "../../../../services/razorpayStatusResolverService";
import { SOCKET_EVENTS } from "../../../../events/socketEvents";
import { toProcessRefundDto } from "../../../../mapper/adminMapper";
import { paymentMessages } from "../../../../../shared/constant/message/paymentMessage";
import { bookingMessages } from "../../../../../shared/constant/message/bookingMessage";

export class ProcessRefundUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _refundRepo: IRefundRepository,
    private _paymentService: IPaymentService,
    private _bookingValidator: BookingValidatorService,
    private _bookingHistory: BookingHistoryService,
    private _paymentLookup: PaymentLookupService,
    private _notificationDispatch: NotificationDispatchService,
    private _statusResolver: RazorpayStatusResolverService,
  ) {}

  async execute(input: IProcessRefundInput): Promise<IProcessRefundOutPut> {
    const { bookingId, adminId, adminNote } = input;

    const booking = await this._bookingValidator.getAndValidateStatusOnly(
      bookingId,
      [BookingStatus.REFUND_APPROVED, BookingStatus.DISPUTE],
    );

    const payment = await this._paymentLookup.getAndValidateStatus(bookingId, [
      PaymentStatus.BEAUTICIAN_APPROVED_REFUND,
      PaymentStatus.REFUND_DISPUTED,
    ]);

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        paymentMessages.ERROR.RAZORPAY_ID_MISSING,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let refund = await this._refundRepo.findByPaymentId(payment.id);

    if (refund?.status === RefundStatus.SUCCESS) {
      throw new AppError(
        paymentMessages.ERROR.REFUND_ALREADY_PROCESSED,
        HttpStatus.CONFLICT,
      );
    }

    if (!refund) {
      refund = await this._refundRepo.create({
        userId: booking.userId,
        paymentId: payment.id,
        amount: payment.amount,
        method: RefundMethod.WALLET,
        status: RefundStatus.PENDING,
        refundType: RefundType.SERVICE_ISSUE,
        reason: booking.refundReason ?? undefined,
        adminNote: adminNote ?? undefined,
      });
    } else {
      refund = await this._refundRepo.updateById(refund.id, { adminNote });
    }

    if (!refund) {
      throw new AppError(
        paymentMessages.ERROR.REFUND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const razorpayRefund = await this._paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );

    const refundStatus = this._statusResolver.resolveRefundStatus(
      razorpayRefund.status,
    );

    const updatedRefund = await this._refundRepo.updateStatus(
      refund.id,
      refundStatus,
      refundStatus === RefundStatus.SUCCESS
        ? { processedAt: new Date() }
        : undefined,
    );
    if (!updatedRefund) {
      throw new AppError(
        paymentMessages.ERROR.REFUND_UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const bookingStatus =
      refundStatus === RefundStatus.SUCCESS
        ? BookingStatus.CLOSED
        : booking.status;

    if (refundStatus === RefundStatus.SUCCESS) {
      await this._paymentRepo.updateStatus(payment.id, PaymentStatus.REFUNDED);
    }

    const updatedBooking = await this._bookingRepo.updateByBookingId(
      bookingId,
      {
        status: bookingStatus,
      },
    );

     if (!updatedBooking) {
      throw new AppError(bookingMessages.ERROR.BOOKING_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this._bookingHistory.log({
      bookingId,
      action: BookingAction.PROCESS_REFUND,
      performedBy: adminId,
      role: UserRole.ADMIN,
      fromStatus: booking.status,
      toStatus: bookingStatus,
    });

    const customerMessage =
      refundStatus === RefundStatus.SUCCESS
        ? "Your refund has been processed successfully."
        : "Refund processing failed. Our team will retry shortly.";

    await this._notificationDispatch.notify({
      userId: booking.userId,
      type:
        refundStatus === RefundStatus.SUCCESS
          ? NotificationType.REFUND_PROCESSED
          : NotificationType.REFUND_FAILED,
      category: NotificationCategory.REFUND,
      title: "Refund Update",
      message: customerMessage,
      socketEvent: SOCKET_EVENTS.REFUND_PROCESSED,
      socketPayload: {
        bookingId,
        amount: payment.amount,
        status: refundStatus,
      },
      metadata: {
        bookingId,
        paymentId: payment.id,
        refundId: updatedRefund.id,
      },
    });

    // ── 11. Notify beautician ──────────────────────────────────────────────
    const beauticianMessage =
      refundStatus === RefundStatus.SUCCESS
        ? `Refund of ₹${payment.amount} was issued to the customer. Reason: ${adminNote ?? "No reason provided."}`
        : `Refund attempt failed. Admin will retry.`;

    await this._notificationDispatch.notify({
      userId: booking.beauticianId,
      type:
        refundStatus === RefundStatus.SUCCESS
          ? NotificationType.DISPUTE_RESOLVED
          : NotificationType.REFUND_FAILED,
      category: NotificationCategory.DISPUTE,
      title: "Dispute Resolved",
      message: beauticianMessage,
      socketEvent: SOCKET_EVENTS.DISPUTE_RESOLVED,
      socketPayload: { bookingId, message: beauticianMessage },
      metadata: { bookingId, paymentId: payment.id },
    });

    const data = toProcessRefundDto({ refund: updatedRefund, payment });
    return { data };
  }
}
