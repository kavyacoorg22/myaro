import { IGetBookingDetailUseCase } from "../../../../interface/admin/management/booking/IGetBookingDetailUseCase";
import { IGetBookingDetailOutPut } from "../../../../interfaceType/adminType";
import { AppError } from "../../../../../domain/errors/appError";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { toAdminBookingDetailDto } from "../../../../mapper/adminMapper";
import { IBookingHistoryRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";

export class GetBookingDetailUseCase implements IGetBookingDetailUseCase {
  constructor(
    private bookingRepo:    IBookingRepository,
    private paymentRepo:    IPaymentRepository,
    private userRepo:       IUserRepository,
    private bookingHistoryRepo:IBookingHistoryRepository
  ) {}

  async execute(bookingId: string): Promise<IGetBookingDetailOutPut> {

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

    const payment = await this.paymentRepo.findByBookingId(bookingId);
    if (!payment) throw new AppError("Payment not found", HttpStatus.NOT_FOUND);

    const [user, beautician] = await Promise.all([
      this.userRepo.findByUserId(booking.userId),
      this.userRepo.findByUserId(booking.beauticianId),
    ]);

    if (!user)       throw new AppError("Customer not found",   HttpStatus.NOT_FOUND);
    if (!beautician) throw new AppError("Beautician not found", HttpStatus.NOT_FOUND);
        const history = await this.bookingHistoryRepo.findByBookingId(payment.bookingId);

    return {
      data:{... toAdminBookingDetailDto(booking, payment, user, beautician),
         history: history.map((h) => ({
      status:    h.toStatus,  
      role:      h.role,
      createdAt: h.createdAt,
    })),
      }
    };
  }
}