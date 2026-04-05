import { RazorpayOrder, RazorpayVerifyInput } from "../interfaceType/paymentType";

export interface IPaymentService {
  createOrder(amount: number, currency?: string): Promise<RazorpayOrder>;
  verifySignature(data: RazorpayVerifyInput): boolean;
}