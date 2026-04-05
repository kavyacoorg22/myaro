export enum PaymentStatus {
  PENDING="pending",
  FAILED='failed',
  PAID = "paid",
  REFUND_REQUESTED = "refund_requested",
  BEAUTICIAN_APPROVED_REFUND = "beautician_approved_refund",
  REFUND_DISPUTED = "refund_disputed",
  REFUNDED = "refunded",
  REFUND_REJECTED = "refund_rejected",
  RELEASED = "released",
  READY_TO_RELEASE = "ready_to_release",
}

export enum PaymentMode {
  RAZORPAY = "razorpay",
  CASH = "cash",
}
