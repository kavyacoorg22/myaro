import { EarningsSummaryDto, RecentPayoutDto } from "../../../../application/dtos/beautician";
import { Payout } from "../../../entities/payout";
import { PayoutStatus } from "../../../enum/paymentEnum";


export interface IPayoutRepository {
  create(data: Omit<Payout, "id" | "createdAt" | "updatedAt">): Promise<Payout>;
  findByPaymentId(paymentId: string): Promise<Payout | null>;
  updateStatus(id: string, status: PayoutStatus): Promise<Payout>;
  getEarningsSummary(beauticianId: string, joinedSince: Date): Promise<EarningsSummaryDto>;
getRecent(beauticianId: string, limit: number): Promise<RecentPayoutDto[]>;
}