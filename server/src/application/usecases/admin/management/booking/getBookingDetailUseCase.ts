import { IGetBookingDetailUseCase } from "../../../../interface/admin/management/booking/IGetBookingDetailUseCase";
import { IGetBookingDetailOutPut } from "../../../../interfaceType/adminType";
import { AppError } from "../../../../../domain/errors/appError";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { toAdminBookingDetailDto } from "../../../../mapper/adminMapper";
import { IBookingHistoryRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { beauticianMessages } from "../../../../../shared/constant/message/beauticianMessage";
import { bookingMessages } from "../../../../../shared/constant/message/bookingMessage";
import { paymentMessages } from "../../../../../shared/constant/message/paymentMessage";

export class GetBookingDetailUseCase implements IGetBookingDetailUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _paymentRepo: IPaymentRepository,
    private _userRepo: IUserRepository,
    private _bookingHistoryRepo: IBookingHistoryRepository,
  ) {}

  async execute(bookingId: string): Promise<IGetBookingDetailOutPut> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking)
      throw new AppError(bookingMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const payment = await this._paymentRepo.findByBookingId(bookingId);
    if (!payment)
      throw new AppError(paymentMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const [user, beautician] = await Promise.all([
      this._userRepo.findByUserId(booking.userId),
      this._userRepo.findByUserId(booking.beauticianId),
    ]);

    if (!user)
      throw new AppError(
        beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    if (!beautician)
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    const history = await this._bookingHistoryRepo.findByBookingId(
      payment.bookingId,
    );

    return {
      data: {
        ...toAdminBookingDetailDto(booking, payment, user, beautician),
        history: history.map((h) => ({
          status: h.toStatus,
          role: h.role,
          createdAt: h.createdAt,
        })),
      },
    };
  }
}
