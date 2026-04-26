import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IPaymentRepository } from "../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetDashboardOverviewUseCase } from "../../../interface/admin/management/dashboard/IdashboardOverViewUseCase";
import { IDashboardOverviewOutput } from "../../../interfaceType/adminType";
import { toDashboardOverviewDto } from "../../../mapper/adminMapper";

export class GetDashboardOverviewUC implements IGetDashboardOverviewUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _paymentRepo: IPaymentRepository,
    private readonly _beauticianRepo: IBeauticianRepository,
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
      this._userRepo.getTotalUsers(),
      this._userRepo.getTotalBeauticians(),
      this._userRepo.getTotalCustomers(),
      this._beauticianRepo.getPendingBeauticians(),
      this._paymentRepo.getTotalRefundAmount(),
      this._paymentRepo.getHeldPayments(),
      this._paymentRepo.getDisputesCount(),
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
