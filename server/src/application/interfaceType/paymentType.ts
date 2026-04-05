import { ICreateOrderDto, IVerifyPaymentDto } from "../dtos/payment";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface RazorpayVerifyInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface IVerifyPaymentUsecaseInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface IVerifyPaymentOutPut {
  data:IVerifyPaymentDto
}

export interface ICreateOrderUsecaseInput {
  bookingId: string;
}

export interface ICreateOrderOutput {
  data:ICreateOrderDto
}