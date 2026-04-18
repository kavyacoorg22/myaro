import { PaymentMode, PaymentStatus } from "../../../domain/enum/paymentEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { appConfig } from "../../../infrastructure/config/config";
import redisClient from "../../../infrastructure/redis/redisClient";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ICreateOrderUsecase } from "../../interface/payment/ICreateOrderUseCase";
import {
  ICreateOrderOutput,
  ICreateOrderUsecaseInput,
} from "../../interfaceType/paymentType";
import { toCreateOrder } from "../../mapper/paymentMapper";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";
import { v4 as uuidv4 } from "uuid";

export class CreateOrderUsecase implements ICreateOrderUsecase {
  constructor(
    private _paymentRepo: IPaymentRepository,
    private _bookingRepo: IBookingRepository,
    private _paymentService: IPaymentService,
  ) {}

  async execute({
    bookingId,
  }: ICreateOrderUsecaseInput): Promise<ICreateOrderOutput> {
    const existingPaid = await this._paymentRepo.findPaidByBookingId(bookingId);
    if (existingPaid) {
      throw new AppError("Booking Already paid", HttpStatus.CONFLICT);
    }

    const lockKey = `payment_lock:${bookingId}`;
    const lockValue = uuidv4();
    const lock = await redisClient.set(lockKey, lockValue, {
      NX: true,
      EX: appConfig.redis.redisLockSlotTtl,
    });

    if (!lock) {
      throw new AppError("Payment already in progress", HttpStatus.CONFLICT);
    }

      const paidInsideLock = await this._paymentRepo.findPaidByBookingId(bookingId);
  if (paidInsideLock) {
    throw new AppError("Booking already paid", HttpStatus.CONFLICT);
  }
    
    
      const booking = await this._bookingRepo.findById(bookingId);
      if (!booking) {
        throw new AppError("booking not found", HttpStatus.NOT_FOUND);
      }

      const order = await this._paymentService.createOrder(booking.totalPrice);

      await this._paymentRepo.create({
        bookingId,
        userId: booking.userId,
        razorpayOrderId: order.id,
        amount: booking.totalPrice,
        currency: order.currency,
        status: PaymentStatus.PENDING,
        mode: PaymentMode.RAZORPAY,
      });

      const data = toCreateOrder(order);
      return { data };
   
  }
}
