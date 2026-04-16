import { RevenueStatsDto } from "../../../../application/dtos/repo";
import { Booking } from "../../../entities/booking";
import { Payment } from "../../../entities/payment";
import { PaymentStatus } from "../../../enum/paymentEnum";

export interface IPaymentRepository{
create(data:Omit<Payment,'id'|'createdAt'|'updatedAt'>):Promise<Payment>
findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null>;
  updateByRazorpayOrderId(
    razorpayOrderId: string,
    data: Partial<Pick<Payment, 'razorpayPaymentId' | 'razorpaySignature' | 'status'>>
  ): Promise<Payment | null>;
  findByBookingId(bookingId:string):Promise<Payment|null>
    updateStatus(
    id: string,
    status: PaymentStatus,
    extra?: {
      refundReason?: string;
      razorpayRefundId?: string;
    }
  ): Promise<Payment | null>;
    updateById(
    id: string,
    data: Partial<Omit<Payment, "id" | "createdAt" | "updatedAt">>
  ): Promise<Payment | null>;
  findById(id:string):Promise<Payment|null>
  findAll(params: {
  page: number;
  limit: number;
  status?: PaymentStatus;
}): Promise<{ payments: Payment[]; total: number }>;
findByIds(ids: string[]): Promise<Payment[]>;
findPaidByBookingId(bookingId: string): Promise<Payment | null>;
findPendingByBookingId(bookingId: string): Promise<Payment | null>;
getHeldPayments():Promise<number>
getDisputesCount():Promise<number>
getRevenueStats(): Promise<RevenueStatsDto>
 getTotalRefundAmount(): Promise<number>
}