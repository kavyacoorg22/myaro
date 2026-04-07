import { Payment } from "../../domain/entities/payment";
import { PaymentStatus } from "../../domain/enum/paymentEnum";
import { AppError } from "../../domain/errors/appError";
import { IPaymentRepository } from "../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { HttpStatus } from "../../shared/enum/httpStatus";
 
export class PaymentLookupService {
  constructor(private paymentRepo: IPaymentRepository) {}
 
  async getByBookingId(bookingId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findByBookingId(bookingId);
    if (!payment) throw new AppError("Payment record not found", HttpStatus.NOT_FOUND);
    return payment;
  }
 
  async getAndValidateStatus(
    bookingId: string,
    allowedStatuses: PaymentStatus[],
  ): Promise<Payment> {
    const payment = await this.getByBookingId(bookingId);
    if (!allowedStatuses.includes(payment.status)) {
      throw new AppError(
        `Payment is not in a valid state for this action`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return payment;
  }
}
 