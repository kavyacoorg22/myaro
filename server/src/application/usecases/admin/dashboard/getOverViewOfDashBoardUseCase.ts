import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IPaymentRepository } from "../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetDashboardOverviewUseCase } from "../../../interface/admin/management/dashboard/IdashboardOverViewUseCase";
import { IDashboardOverviewOutput } from "../../../interfaceType/adminType";
import { toDashboardOverviewDto } from "../../../mapper/adminMapper";

export class GetDashboardOverviewUC implements IGetDashboardOverviewUseCase {
  constructor(
    private readonly userRepo:    IUserRepository,
    private readonly paymentRepo: IPaymentRepository,
    private readonly beauticianRepo:IBeauticianRepository
  ) {}
 
  async execute(): Promise<IDashboardOverviewOutput> {
    const [
      totalUsers,
      totalBeauticians,
      totalCustomers,
      pendingVerifications,
      totalRefundAmount,
      heldPaymentAmount,
      disputesCount,
    ] = await Promise.all([
      this.userRepo.getTotalUsers(),
      this.userRepo.getTotalBeauticians(),
      this.userRepo.getTotalCustomers(),
      this.beauticianRepo.getPendingBeauticians(),
      this.paymentRepo.getTotalRefundAmount(),
      this.paymentRepo.getHeldPayments(),
      this.paymentRepo.getDisputesCount(),
    ]);
 
    return toDashboardOverviewDto({
      totalUsers,
      totalBeauticians,
      totalCustomers,
      pendingVerifications,
      totalRefundAmount,
      heldPaymentAmount,
      disputesCount,
    });
  }
}