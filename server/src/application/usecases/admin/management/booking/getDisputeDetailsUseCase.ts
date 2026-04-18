import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingHistoryRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetDisputeDetailsUseCase } from "../../../../interface/admin/management/booking/IGetDisputeDetailUseCase";
import { IGetDisputeDetailOutput } from "../../../../interfaceType/adminType";
import { toAdminDisputeDetail } from "../../../../mapper/adminMapper";

export class GetDisputeDetailsUseCase implements IGetDisputeDetailsUseCase {
  constructor(
    private _bookingRepo:        IBookingRepository,
    private _paymentRepo:        IPaymentRepository,
    private _userRepo:           IUserRepository,
    private _bookingHistoryRepo: IBookingHistoryRepository,
  ) {}

  async execute(bookingId: string): Promise<IGetDisputeDetailOutput> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const payment = await this._paymentRepo.findByBookingId(bookingId);
    if (!payment) throw new Error("Payment not found");

    const [[user], [beautician], history] = await Promise.all([
      this._userRepo.findUsersByIds([booking.userId]),
      this._userRepo.findUsersByIds([booking.beauticianId]),
      this._bookingHistoryRepo.findByBookingId(bookingId),
    ]);

    if (!user || !beautician) throw new Error("User or beautician not found");

    return {
      data: {
        ...toAdminDisputeDetail(
          booking,
          payment,
          `${user.fullName}`,
          `${beautician.fullName}`,
        ),
        history: history.map((h) => ({
          status:    h.toStatus,
          role:      h.role,
          createdAt: h.createdAt,
        })),
      },
    };
  }
}