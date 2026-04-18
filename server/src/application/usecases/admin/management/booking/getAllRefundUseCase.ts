import { Refund }  from "../../../../../domain/entities/refund";
import { Payment } from "../../../../../domain/entities/payment";
import { IUserRepository }    from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository }  from "../../../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { toAdminRefundListItem } from "../../../../mapper/adminMapper";
import { IGetAllRefundsUseCase } from "../../../../interface/admin/management/booking/IgetAllRefundsUseCase";
import { IGetAllRefundInput, IGetAllRefundOutput } from "../../../../interfaceType/adminType";
import { IGetAllRefundsDto } from "../../../../dtos/admin";

export class GetAllRefundsUseCase implements IGetAllRefundsUseCase {
  constructor(
    private _refundRepo:  IRefundRepository,
    private _paymentRepo: IPaymentRepository,
    private _bookingRepo: IBookingRepository,
    private _userRepo:    IUserRepository,
  ) {}

  async execute({ page = 1, limit = 10,status }: IGetAllRefundInput): Promise<IGetAllRefundOutput> {
     console.log('status',status)
    const { refunds, total } = await this._refundRepo.findAll({ page, limit,status });
    console.log(refunds,total)
    const totalPages = Math.ceil(total / limit);

    if (refunds.length === 0) {
      return { data: [], total, page, totalPages, hasMore: false };
    }

    const paymentIds = [...new Set(refunds.map((r: Refund) => r.paymentId))];
    const payments   = await this._paymentRepo.findByIds(paymentIds);
    const paymentMap = new Map(payments.map((p: Payment) => [p.id, p]));

    const bookingIds = [...new Set(payments.map((p: Payment) => p.bookingId))];
    const bookings   = await this._bookingRepo.findByIds(bookingIds);
    const bookingMap = new Map(bookings.map(b => [b.id, b]));

    const userIds = [...new Set(bookings.map(b => b.userId))];
    const users   = await this._userRepo.findUsersByIds(userIds);
    const userMap = new Map(users.map(u => [u.id, u]));

    const data = refunds
      .map((refund: Refund): IGetAllRefundsDto | null => {
        const payment = paymentMap.get(refund.paymentId);
        const booking = payment ? bookingMap.get(payment.bookingId) : null;
        const user    = booking ? userMap.get(booking.userId)       : null;

        if (!payment || !booking || !user) return null;

        return toAdminRefundListItem(
          refund,
          booking,
          `${user.fullName}`,
        );
      })
      .filter((item): item is IGetAllRefundsDto => item !== null);

    return { data, total, page, totalPages, hasMore: page < totalPages };
  }
}