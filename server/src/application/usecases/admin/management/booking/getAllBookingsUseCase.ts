import { Payment } from "../../../../../domain/entities/payment";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetAllBookingDto } from "../../../../dtos/admin";
import { IGetAllBookingsUseCase } from "../../../../interface/admin/management/booking/IGetAllBookingsUseCase";
import { IGetAllBookingsInput, IGetAllBookingOutPut } from "../../../../interfaceType/adminType";
import { toAdminBookingListItem } from "../../../../mapper/adminMapper";


export class GetAllBookingUseCase implements IGetAllBookingsUseCase{
 constructor(
    private _bookingRepo:    IBookingRepository,
    private _paymentRepo:    IPaymentRepository,
    private _userRepo:       IUserRepository,
  ) {}

  async execute({ page = 1, limit = 10, paymentStatus }: IGetAllBookingsInput): Promise<IGetAllBookingOutPut> {

    const { payments, total } = await this._paymentRepo.findAll({ page, limit, status: paymentStatus });

    const totalPages = Math.ceil(total / limit);

    const bookingIds = payments.map((p: Payment) => p.bookingId);
    const bookings   = await this._bookingRepo.findByIds(bookingIds);

    const userIds       = [...new Set(bookings.map(b => b.userId))];
    const beauticianIds = [...new Set(bookings.map(b => b.beauticianId))];

    const users       = await this._userRepo.findUsersByIds(userIds);
    const beauticians = await this._userRepo.findUsersByIds(beauticianIds);

    const userMap       = new Map(users.map(u => [u.id, u]));
    const beauticianMap = new Map(beauticians.map(b => [b.id, b]));
    const bookingMap    = new Map(bookings.map(b => [b.id, b]));

   
    const data = payments
      .map((payment: Payment) => {
        const booking    = bookingMap.get(payment.bookingId);
        const user       = booking ? userMap.get(booking.userId) : null;
        const beautician = booking ? beauticianMap.get(booking.beauticianId) : null;

        if (!booking || !user || !beautician) return null;

        return toAdminBookingListItem(booking, payment, user, beautician);
      })
      .filter((item): item is IGetAllBookingDto=> item !== null);

    return { data, total, page, totalPages, hasMore: page < totalPages };
  }
}