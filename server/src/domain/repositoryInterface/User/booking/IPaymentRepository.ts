import { Payment } from "../../../entities/payment";

export interface IPaymentRepository{
create(data:Omit<Payment,'id'|'createdAt'|'updatedAt'>):Promise<Payment>
findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null>;
  updateByRazorpayOrderId(
    razorpayOrderId: string,
    data: Partial<Pick<Payment, 'razorpayPaymentId' | 'razorpaySignature' | 'status'>>
  ): Promise<Payment | null>;
}