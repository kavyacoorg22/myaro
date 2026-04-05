import { PaymentMode, PaymentStatus } from "../enum/paymentEnum";

export interface Payment {
  id: string
  bookingId: string
  userId:string
  razorpayOrderId: string // created when  call razorpay.orders.create()
  razorpayPaymentId?: string // available only after payment success
  razorpaySignature?: string // available only after verification
  amount: number
    currency: string 
  status: PaymentStatus
  mode: PaymentMode
   failureReason?: string    
  paidAt?: Date
  releasedAt?: Date
  releasedBy?: string
  createdAt: Date
  updatedAt: Date
}
