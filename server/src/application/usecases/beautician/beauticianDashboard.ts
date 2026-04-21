import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IPayoutRepository } from "../../../domain/repositoryInterface/User/admin/IPayoutRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IGetBeauticianDashboardUseCase } from "../../interface/beautician/IBeauticianDashBoardUseCase";
import { IGetBeauticianDashboardOutPut } from "../../interfaceType/beauticianType";
import { toBeauticianDashboardDto } from "../../mapper/beauticianMapper";


export class GetBeauticianDashboardUseCase implements IGetBeauticianDashboardUseCase {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly payoutRepo:  IPayoutRepository,
    private readonly userRepo:    IUserRepository,
  ) {}

  async execute(beauticianId: string): Promise<IGetBeauticianDashboardOutPut> {
    const beautician = await this.userRepo.findByUserId(beauticianId);

    const [stats, weeklyChart, monthlyChart, earnings, recentPayouts] =
      await Promise.all([
        this.bookingRepo.getDashboardStats(beauticianId),
        this.bookingRepo.getWeeklyEarnings(beauticianId),
        this.bookingRepo.getMonthlyEarnings(beauticianId),
        this.payoutRepo.getEarningsSummary(beauticianId, beautician?.createdAt ?? new Date()),
        this.payoutRepo.getRecent(beauticianId, 5),
      ]);

    const data= toBeauticianDashboardDto({
      stats,
      earnings,
      weeklyChart,
      monthlyChart,
      recentPayouts,
    });

    return {data}
  }
}