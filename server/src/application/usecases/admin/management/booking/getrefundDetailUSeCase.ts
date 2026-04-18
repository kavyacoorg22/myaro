import { IUserRepository }    from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingHistoryRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository }  from "../../../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { IGetRefundDetailUseCase } from "../../../../interface/admin/management/booking/IGetRefundDetailUseCase";
import { IGetRefundDetailOutput }  from "../../../../interfaceType/adminType";
import { toAdminRefundDetail }     from "../../../../mapper/adminMapper";

export class GetRefundDetailUseCase implements IGetRefundDetailUseCase {
  constructor(
    private _refundRepo:  IRefundRepository,
    private _paymentRepo: IPaymentRepository,
    private _bookingRepo: IBookingRepository,
    private _userRepo:    IUserRepository,
    private _bookingHistoryRepo:IBookingHistoryRepository
  ) {}

  async execute(refundId: string): Promise<IGetRefundDetailOutput> {

    const refund = await this._refundRepo.findById(refundId);
    if (!refund) throw new Error("Refund not found");

    const payment = await this._paymentRepo.findById(refund.paymentId);
    if (!payment) throw new Error("Payment not found");

    const booking = await this._bookingRepo.findById(payment.bookingId);
    if (!booking) throw new Error("Booking not found");

    const users = await this._userRepo.findUsersByIds([payment.userId]);
    const user  = users[0];
    if (!user) throw new Error("User not found");
    const history = await this._bookingHistoryRepo.findByBookingId(payment.bookingId);
    return {
  data: {
    ...toAdminRefundDetail(refund, payment, booking, `${user.fullName}`),
    history: history.map((h) => ({
      status:    h.toStatus,  
      role:      h.role,
      createdAt: h.createdAt,
    })),
}
}
  }}
