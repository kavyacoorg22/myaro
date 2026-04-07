import { RefundMethod, RefundStatus, RefundType } from "../enum/paymentEnum"

export interface Refund {
  id: string
  paymentId: string
  amount: number
  method: RefundMethod
  status: RefundStatus
  refundType:RefundType,
  razorpayRefundId?: string
  reason?: string
  createdAt: Date,
  updatedAt:Date,
  processedAt?: Date
}