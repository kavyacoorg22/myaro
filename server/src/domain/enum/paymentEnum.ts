export enum PaymentStatus {
  PENDING="pending",
  FAILED='failed',
  PAID = "paid",
  REFUND_REQUESTED = "refund_requested",
  REFUND_INITIATED = "refund_initiated",
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

export enum PayoutStatus{
  PENDING='pending',
  COMPLETED='completed',
  FAILED='failed'
}

export enum RefundType{
   CANCELLATION="cancellation" ,
    SERVICE_ISSUE="service_issue"
}

export enum RefundMethod{
  SOURCE='source',
  WALLET='wallet'
}

export enum RefundStatus{
  PENDING='pending',
  PROCESSED='processed',
  FAILED='failed'
}