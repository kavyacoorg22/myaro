import { Payout } from "../../../entities/payout";
import { PayoutStatus } from "../../../enum/paymentEnum";


export interface IPayoutRepository {
  create(data: Omit<Payout, "id" | "createdAt" | "updatedAt">): Promise<Payout>;
  findByPaymentId(paymentId: string): Promise<Payout | null>;
  updateStatus(id: string, status: PayoutStatus): Promise<Payout>;
}