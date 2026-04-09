import { Payment } from "../../domain/entities/payment";
import { Payout } from "../../domain/entities/payout";
import { Refund } from "../../domain/entities/refund";
import { IProcessRefundDto, IReleasePayoutDto } from "../dtos/admin";

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