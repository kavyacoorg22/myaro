import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IPayoutRepository } from "../../../domain/repositoryInterface/User/admin/IPayoutRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { ICommentRepository } from "../../../domain/repositoryInterface/User/ICommetRepository";
import { IGetBeauticianDashboardUseCase } from "../../interface/beautician/IBeauticianDashBoardUseCase";
import { IGetBeauticianDashboardOutPut } from "../../interfaceType/beauticianType";
import { toBeauticianDashboardDto } from "../../mapper/beauticianMapper";

export class GetBeauticianDashboardUseCase implements IGetBeauticianDashboardUseCase {
  constructor(
    private readonly _bookingRepo: IBookingRepository,
    private readonly _payoutRepo: IPayoutRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _commentRepo: ICommentRepository,
  ) {}
  async execute(beauticianId: string): Promise<IGetBeauticianDashboardOutPut> {
    const beautician = await this._userRepo.findByUserId(beauticianId);

    const [
      stats,
      weeklyChart,
      monthlyChart,
      payoutSummary,
      totalEarnings,
      recentPayouts,
      { avgRating, totalReviews },
    ] = await Promise.all([
      this._bookingRepo.getDashboardStats(beauticianId),
      this._bookingRepo.getWeeklyEarnings(beauticianId),
      this._bookingRepo.getMonthlyEarnings(beauticianId),
      this._payoutRepo.getEarningsSummary(
        beauticianId,
        beautician?.createdAt ?? new Date(),
      ),
      this._bookingRepo.getTotalEarnings(beauticianId),
      this._payoutRepo.getRecent(beauticianId, 5),
      this._commentRepo.getRatingSummary(beauticianId),
    ]);

    const earnings = {
      totalEarnings,
      withdrawableAmount: Math.max(
        0,
        totalEarnings - payoutSummary.totalEarnings,
      ), // earned minus paid out by admin
      pendingAmount: payoutSummary.pendingAmount, // admin approved but not yet completed
      joinedSince: payoutSummary.joinedSince,
    };

    const data = toBeauticianDashboardDto({
      stats,
      earnings,
      weeklyChart,
      monthlyChart,
      recentPayouts,
      avgRating,
      totalReviews,
    });

    return { data };
  }
}
