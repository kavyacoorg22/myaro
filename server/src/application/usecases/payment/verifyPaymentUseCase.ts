import { BookingAction, BookingStatus } from "../../../domain/enum/bookingEnum";
import { PaymentStatus } from "../../../domain/enum/paymentEnum";
import { UserRole } from "../../../domain/enum/userEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import redisClient from "../../../infrastructure/redis/redisClient";
import { releaseLock } from "../../../infrastructure/shared/releaseLock";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBlockBookedSlotUSeCase } from "../../interface/beautician/schedule/IBlockBookedSlotUSeCase";
import { IUpdateBookingStatusUseCase } from "../../interface/booking/IUpdateBookingStatusUSeCase";
import { IVerifyPaymentUsecase } from "../../interface/payment/IVerifyPaymentUseCase";
import {
  IVerifyPaymentOutPut,
  IVerifyPaymentUsecaseInput,
} from "../../interfaceType/paymentType";
import { toVerifyPayment } from "../../mapper/paymentMapper";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";

export class VerifyPaymentUsecase implements IVerifyPaymentUsecase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private bookingRepo: IBookingRepository,
    private paymentService: IPaymentService,
    private blockSlotUC: IBlockBookedSlotUSeCase,
        private updateBookingStatusUC: IUpdateBookingStatusUseCase,

  ) {}
  async execute(
    data: IVerifyPaymentUsecaseInput,
  ): Promise<IVerifyPaymentOutPut> {
    const isValid = this.paymentService.verifySignature(data);

    if (!isValid) {
      await this.paymentRepo.updateByRazorpayOrderId(data.razorpay_order_id, {
        status: PaymentStatus.FAILED,
      });
      throw new AppError("Invalid payment signature", HttpStatus.BAD_REQUEST);
    }

    const payment = await this.paymentRepo.updateByRazorpayOrderId(
      data.razorpay_order_id,
      {
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
        status: PaymentStatus.PAID,
      },
    );
    if (!payment)
      throw new AppError("Payment record not found", HttpStatus.NOT_FOUND);
    const booking = await this.bookingRepo.findById(payment.bookingId);
    if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

    const lockKey = `payment_lock:${payment.bookingId}`;
    const storedValue = await redisClient.get(lockKey);
    if (storedValue) {
      await releaseLock(lockKey, storedValue);
    }

     await this.updateBookingStatusUC.execute({
      bookingId:   payment.bookingId,
      performedBy: booking.userId,     
      role:        UserRole.CUSTOMER,
      action:      BookingAction.CONFIRM, 
    });
    const [startTime, endTime] = booking.slot.time.split(" – ");
    await this.blockSlotUC.execute({
      beauticianId: booking.beauticianId,
      date: new Date(booking.slot.date),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    });

    const dto = toVerifyPayment(payment, true);
    return { data: dto };
  }
}
