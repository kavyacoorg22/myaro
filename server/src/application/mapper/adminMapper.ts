import { Payment } from "../../domain/entities/payment";
import { Refund } from "../../domain/entities/refund";
import { IProcessRefundDto } from "../dtos/admin";

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
 