import Razorpay from "razorpay";
import { IPaymentService } from "../../application/serviceInterface/IPaymentServie";
import { appConfig } from "../config/config";
import { RazorpayOrder, RazorpayVerifyInput } from "../../application/interfaceType/paymentType";
import crypto from "crypto";

export class RazorPayService implements IPaymentService{
  private razorPay:Razorpay
  constructor()
  {
    this.razorPay=new Razorpay({
      key_id:appConfig.razorPay.razorPayKeyId,
      key_secret:appConfig.razorPay.razorPayKeySecret
    })
  }

 async createOrder(amount: number, currency="INR"): Promise<RazorpayOrder> {
     const order=await this.razorPay.orders.create({
      amount:amount*100,
      currency
     })

     return {id:order.id,amount:Number(order.amount),currency:order.currency}
  }
 

   verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: RazorpayVerifyInput): boolean {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", appConfig.razorPay.razorPayKeySecret)
      .update(body)
      .digest("hex");
    return expectedSignature === razorpay_signature;
  }

  async refundPayment(
  paymentId: string,
  amount?: number
): Promise<{ id: string; status: string }> {

  const refund = await this.razorPay.payments.refund(paymentId, {
    amount: amount ? amount * 100 : undefined, // optional (paise)
  });

  return {
    id: refund.id,
    status: refund.status,
  };
}
}