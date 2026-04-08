import {
  BookingAction,
  BookingStatus,
} from "../../../../../domain/enum/bookingEnum";
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
import { ISocketEmitter } from "../../../../serviceInterface/ISocketEmitter";
import { BookingHistoryService } from "../../../../services/bookingHistoryService";
import { BookingValidatorService } from "../../../../services/bookingValidatorService";
import { PaymentLookupService } from "../../../../services/paymentLookupService";
import { SOCKET_EVENTS } from "../../../../events/socketEvents";
import { toProcessRefundDto } from "../../../../mapper/adminMapper";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { IProcessRefundUseCase } from "../../../../interface/admin/management/booking/IProcessRefundUseCase";

export class ProcessRefundUseCase implements IProcessRefundUseCase {
  constructor(
    private bookingRepo: IBookingRepository,
    private paymentRepo: IPaymentRepository,
    private refundRepo: IRefundRepository,
    private paymentService: IPaymentService,
    private socketEmitter: ISocketEmitter,
    private bookingValidator: BookingValidatorService,
    private bookingHistory: BookingHistoryService,
    private paymentLookup: PaymentLookupService,
  ) {}

  async execute(input: IProcessRefundInput): Promise<IProcessRefundOutPut> {
    const { paymentId, adminId } = input;

    const paymentData = await this.paymentRepo.findById(paymentId);
    if (!paymentData) {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST);
    }
    const bookingData = await this.bookingRepo.findById(paymentData.bookingId);
    if (!bookingData) {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST);
    }
    const booking = await this.bookingValidator.getAndValidateStatusOnly(
      paymentData.bookingId,
      [BookingStatus.REFUND_APPROVED, BookingStatus.DISPUTE],
    );

    // Validate payment
    const payment = await this.paymentLookup.getAndValidateStatus(
      bookingData.id,
      [PaymentStatus.BEAUTICIAN_APPROVED_REFUND, PaymentStatus.REFUND_DISPUTED],
    );

    if (!payment.razorpayPaymentId) {
      throw new AppError(
        "Razorpay payment ID missing. Cannot process refund.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let refund = await this.refundRepo.findByPaymentId(payment.id);

    // ── 4. Idempotency: block duplicate processing ─────────────────────────
    if (refund?.status === RefundStatus.SUCCESS) {
      throw new AppError(
        "Refund already processed successfully.",
        HttpStatus.CONFLICT,
      );
    }

    if (!refund) {
      refund = await this.refundRepo.create({
        paymentId: payment.id,
        amount: payment.amount,
        method: RefundMethod.SOURCE,
        status: RefundStatus.PENDING,
        refundType: RefundType.SERVICE_ISSUE,
        reason: booking.refundReason ?? undefined,
      });
    }

    //  Call Razorpay
    const razorpayRefund = await this.paymentService.refundPayment(
      payment.razorpayPaymentId,
      payment.amount,
    );

    let refundStatus: RefundStatus;
    if (razorpayRefund.status === "processed") {
      refundStatus = RefundStatus.SUCCESS;
    } else if (razorpayRefund.status === "failed") {
      refundStatus = RefundStatus.FAILED;
    } else {
      refundStatus = RefundStatus.PENDING;
    }

   
    const updatedRefund = await this.refundRepo.updateStatus(
  refund.id,
  refundStatus,
  {
    razorpayRefundId: razorpayRefund.id,
  }
);

if (refundStatus === RefundStatus.SUCCESS) {
  await this.paymentRepo.updateById(payment.id, {
    status: PaymentStatus.REFUNDED,
    refundedId: refund.id,                      
    refundReason: booking.refundReason ?? undefined, 
  });
}

    if (!updatedRefund) {
      throw new AppError(
        "Failed to update refund status",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const bookingStatus =
      refundStatus === RefundStatus.SUCCESS
        ? BookingStatus.CLOSED
        : booking.status;

    const updatedBooking = await this.bookingRepo.updateByBookingId(bookingData.id, {
  status: bookingStatus,
  ...(refundStatus === RefundStatus.SUCCESS && {
    refundType: RefundType.SERVICE_ISSUE,      
    refundedAt: new Date(),                     
  }),
});

    if (!updatedBooking) {
      throw new AppError(
        "Failed to update booking",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.bookingHistory.log({
      bookingId: bookingData.id,
      action: BookingAction.PROCESS_REFUND,
      performedBy: adminId,
      role: UserRole.ADMIN,
      fromStatus: booking.status,
      toStatus: bookingStatus,
    });

    // ── 11. TODO: notification repo ───────────────────────────────────────
    // await this.notificationRepo.create({
    //   userId:    booking.userId,
    //   type:      "booking",
    //   message:   ACTION_MESSAGE[BookingAction.PROCESS_REFUND],
    //   bookingId,
    // });

    const socketMessage =
      refundStatus === RefundStatus.SUCCESS
        ? "Your refund has been processed successfully."
        : "Refund processing failed. Our team will retry shortly.";

    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.REFUND_PROCESSED,
      {
        bookingId: bookingData.id,
        amount: payment.amount,
        status: refundStatus,
        message: socketMessage,
      },
    );

    this.socketEmitter.emitToRoom(
      `user:${booking.userId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        lastMessage: socketMessage,
        lastMessageAt: new Date(),
        type: "refund_processed",
      },
    );

    const data = toProcessRefundDto({ refund: updatedRefund, payment });
    return { data };
  }
}
