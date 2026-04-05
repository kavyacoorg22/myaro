export interface ICreateOrderDto{
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface IVerifyPaymentDto{
  success: boolean;
  paymentId: string;
  bookingId: string;
}