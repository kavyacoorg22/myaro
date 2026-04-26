import { AppError } from "../../../../../domain/errors/appError";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingHistoryRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IRefundRepository } from "../../../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { bookingMessages } from "../../../../../shared/constant/message/bookingMessage";
import { paymentMessages } from "../../../../../shared/constant/message/paymentMessage";
import { userMessages } from "../../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetRefundDetailUseCase } from "../../../../interface/admin/management/booking/IGetRefundDetailUseCase";
import { IGetRefundDetailOutput } from "../../../../interfaceType/adminType";
import { toAdminRefundDetail } from "../../../../mapper/adminMapper";

export class GetRefundDetailUseCase implements IGetRefundDetailUseCase {
  constructor(
    private _refundRepo: IRefundRepository,
    private _paymentRepo: IPaymentRepository,
    private _bookingRepo: IBookingRepository,
    private _userRepo: IUserRepository,
    private _bookingHistoryRepo: IBookingHistoryRepository,
  ) {}

  async execute(refundId: string): Promise<IGetRefundDetailOutput> {
    const refund = await this._refundRepo.findById(refundId);
    if (!refund)
      throw new AppError(
        paymentMessages.ERROR.REFUND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const payment = await this._paymentRepo.findById(refund.paymentId);
    if (!payment)
      throw new AppError(paymentMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const booking = await this._bookingRepo.findById(payment.bookingId);
    if (!booking)
      throw new AppError(bookingMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const users = await this._userRepo.findUsersByIds([payment.userId]);
    const user = users[0];
    if (!user)
      throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    const history = await this._bookingHistoryRepo.findByBookingId(
      payment.bookingId,
    );
    return {
      data: {
        ...toAdminRefundDetail(refund, payment, booking, `${user.fullName}`),
        history: history.map((h) => ({
          status: h.toStatus,
          role: h.role,
          createdAt: h.createdAt,
        })),
      },
    };
  }
}
