import { RefundStatus, PayoutStatus } from "../../domain/enum/paymentEnum";

export class RazorpayStatusResolverService {
  resolveRefundStatus(razorpayStatus: string): RefundStatus {
    switch (razorpayStatus) {
      case "processed": return RefundStatus.SUCCESS;
      case "failed":    return RefundStatus.FAILED;
      default:          return RefundStatus.PENDING;
    }
  }

  resolvePayoutStatus(razorpayStatus: string): PayoutStatus {
    switch (razorpayStatus) {
      case "processed": return PayoutStatus.COMPLETED;
      case "failed":    return PayoutStatus.FAILED;
      default:          return PayoutStatus.PENDING;
    }
  }
}