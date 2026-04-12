import { Booking } from "../../domain/entities/booking";
import { BookingHistory } from "../../domain/entities/bookingHistory";
import { Payment } from "../../domain/entities/payment";
import { Payout } from "../../domain/entities/payout";
import { Refund } from "../../domain/entities/refund";
import { User } from "../../domain/entities/User";
import { IGetAllBookingDto, IGetAllDisputesDto, IGetAllRefundsDto, IGetBookingDetailDto, IGetDisputeDetailDto, IGetRefundDetailDto, IProcessRefundDto, IReleasePayoutDto } from "../dtos/admin";

export function toProcessRefundDto(result: {
  refund:   Refund;
  payment:  Payment;
}): IProcessRefundDto {
  return {
    success:      true,
    refundId:     result.refund.id,
    refundAmount: result.payment.amount,
    status:       result.refund.status,
    message:      "Refund processed successfully.",
  };
}
 
export function toReleasePayoutDto(result: {
  payout:  Payout;
  payment: Payment;
}): IReleasePayoutDto {
  return {
    success:      true,
    payoutId:     result.payout.id,
    payoutAmount: result.payment.amount,
    status:       result.payout.status,
    message:      "Payout released to beautician successfully.",
  };
}

export function toAdminBookingListItem(
  booking:    Booking,
  payment:    Payment,
  user:       User,
  beautician: User,
): IGetAllBookingDto {
  return {
    bookingId:      booking.id,
    customerName:   user.fullName,
    beauticianName: beautician.fullName,
    bookedDate:     booking.createdAt.toISOString(),
    serviceDate:    booking.slot.date.toISOString(),
    amount:         payment.amount,
    paymentStatus:  payment.status,
  };
}

export function toAdminBookingDetailDto(
  booking:    Booking,
  payment:    Payment,
  user:       User,
  beautician: User,
): IGetBookingDetailDto {
  return {
    bookingId:      booking.id,
    customerName:   user.fullName,
    beauticianName: beautician.fullName,
    bookedDate:     booking.createdAt.toISOString(),
    serviceDate:    booking.slot.date.toISOString(),
    amount:         payment.amount,
    paymentStatus:  payment.status,
    services:       booking.services.map(s => s.name),
    paymentId:      payment.razorpayPaymentId ?? payment.id,
    method:         payment.mode,
    paidAt:         payment.paidAt?.toISOString() ?? "",
  };
}


export function toAdminDisputeListItem(
  booking: Booking,
  customerName: string,
  beauticianName: string,
): IGetAllDisputesDto {
  return {
    disputeId:      booking.id,
    bookingId:      booking.id,
    customerName,
    beauticianName,
    status:         booking.status,
    disputeReason:  booking.disputeReason   ?? null,
    disputeAt:      booking.disputeAt,
  };
}



export function toAdminDisputeDetail(
  booking:       Booking,
  payment:       Payment,
  customerName:  string,
  beauticianName: string,
): IGetDisputeDetailDto {
  return {
    disputeId:      booking.id,
    bookingId:      booking.id,
    customerName,
    beauticianName,
    status:         booking.status,
    disputeReason:  booking.disputeReason  ?? null,  
    refundReason:   booking.refundReason   ?? null,  
    disputeAt:      booking.disputeAt,
    paymentId:      payment.id,
    amount:         payment.amount,
  };
}

export function toAdminRefundListItem(
  refund:       Refund,
  booking:      Booking,
  customerName: string,
): IGetAllRefundsDto {
  return {
    refundId:     refund.id,
    bookingId:    booking.id,
    customerName,
    amount:       refund.amount,
    status:       refund.status,
    refundType:   refund.refundType,
    reason:       refund.reason,
    createdAt:    refund.createdAt.toISOString(),
  };
}




export function toAdminRefundDetail(
  refund:       Refund,
  payment:      Payment,
  booking:      Booking,
  customerName: string,
): IGetRefundDetailDto {
  return {
    refundId:           refund.id,
    bookingId:          payment.bookingId,
    customerName,
    amount:             refund.amount,
    status:             refund.status,
    refundReason:       refund.reason,
    customerStatement:  booking.refundReason  ? "Submitted" : "None",
    beauticianResponse: booking.disputeReason ? "Submitted" : "None",
  };
}

