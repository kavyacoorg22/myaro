import { Payment } from "../../domain/entities/payment";
import { ICreateOrderDto, IVerifyPaymentDto } from "../dtos/payment";
import { RazorpayOrder } from "../interfaceType/paymentType";

export function toCreateOrder(order:RazorpayOrder):ICreateOrderDto{
  return{
    razorpayOrderId:order.id,
    amount:order.amount,
    currency:order.currency
  }
}

export function toVerifyPayment(payment:Payment,status:boolean):IVerifyPaymentDto{
  return{
     success:status,
     paymentId:payment.id,
     bookingId:payment.bookingId
  }
}