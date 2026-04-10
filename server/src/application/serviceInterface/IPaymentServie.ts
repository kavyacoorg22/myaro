import { RazorpayOrder, RazorpayVerifyInput } from "../interfaceType/paymentType";

export interface IPaymentService {
  createOrder(amount: number, currency?: string): Promise<RazorpayOrder>;
  verifySignature(data: RazorpayVerifyInput): boolean;
  refundPayment(paymentId:string,amount?:number):Promise<{id:string,status:string}>
    releasePayout(beauticianId: string, amount: number): Promise<{ id: string; status: string }>;
}