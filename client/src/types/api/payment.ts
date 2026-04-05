import type { ICreateOrderDto, IVerifyPaymentDto } from "../dtos/payment";

export interface ICreateOrderResponse {
  data:ICreateOrderDto
}

export interface IVerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface IVerifyPaymentResponse {
  data:IVerifyPaymentDto
}