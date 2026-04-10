
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetDisputeDetailsUseCase } from "../../../../interface/admin/management/booking/IGetDisputeDetailUseCase";
import { IGetDisputeDetailOutput } from "../../../../interfaceType/adminType";
import { toAdminDisputeDetail } from "../../../../mapper/adminMapper";

export class GetDisputeDetailsUseCase implements IGetDisputeDetailsUseCase {
  constructor(
    private bookingRepo:    IBookingRepository,
    private paymentRepo:    IPaymentRepository,
    private userRepo:       IUserRepository,
  ) {}

  async execute(bookingId: string): Promise<IGetDisputeDetailOutput> {

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const payment = await this.paymentRepo.findByBookingId(bookingId);
    if (!payment) throw new Error("Payment not found");

    const [users, beauticians] = await Promise.all([
      this.userRepo.findUsersByIds([booking.userId]),
      this.userRepo.findUsersByIds([booking.beauticianId]),
    ]);

    const user       = users[0];
    const beautician = beauticians[0];

    if (!user || !beautician) throw new Error("User or beautician not found");

    return {
      data: toAdminDisputeDetail(
        booking,
        payment,
        `${user.fullName} `,
        `${beautician.fullName} `,
      ),
    };
  }
}