export const PaymentStatus= {
  PENDING:"pending",
  FAILED:'failed',
  PAID : "paid",
  REFUND_REQUESTED : "refund_requested",
  REFUND_INITIATED : "refund_initiated",
  BEAUTICIAN_APPROVED_REFUND : "beautician_approved_refund",
  REFUND_DISPUTED : "refund_disputed",
  REFUNDED : "refunded",
  REFUND_REJECTED : "refund_rejected",
  RELEASED : "released",
  READY_TO_RELEASE : "ready_to_release",
}
export type PaymentStatusType=(typeof PaymentStatus)[keyof typeof PaymentStatus]

export const PaymentMode ={
  RAZORPAY : "razorpay",
  CASH : "cash",
}

export type PaymentModeType=(typeof PaymentMode)[keyof typeof PaymentMode]

export const PayoutStatus={
  PENDING:'pending',
  COMPLETED:'completed',
  FAILED:'failed'
}
export type PayoutStatusType=(typeof PayoutStatus)[keyof typeof PayoutStatus]

export const RefundType={
  CANCELLATION:"cancellation" ,
    SERVICE_ISSUE:"service_issue"
}
export type RefundTypes=(typeof RefundType)[keyof typeof RefundType]


export const RefundMethod={
  SOURCE:'source',
  WALLET:'wallet'
}
export type RefundMethodType=(typeof RefundMethod)[keyof typeof RefundMethod]

export const RefundStatus={
  PENDING:'pending',
  SUCCESS:'success',
  FAILED:'failed'
}
export type RefundStatusType=(typeof RefundStatus)[keyof typeof RefundStatus]
