import { PaymentMode, PaymentStatus } from "../../../domain/enum/paymentEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ICreateOrderUsecase } from "../../interface/payment/ICreateOrderUseCase";
import { ICreateOrderOutput, ICreateOrderUsecaseInput } from "../../interfaceType/paymentType";
import { toCreateOrder } from "../../mapper/paymentMapper";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";


export class CreateOrderUsecase implements ICreateOrderUsecase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private bookingRepo: IBookingRepository,
    private paymentService: IPaymentService
  ) {}

  async execute({ bookingId }: ICreateOrderUsecaseInput): Promise<ICreateOrderOutput> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) 
    {
      throw new AppError('booking not found',HttpStatus.NOT_FOUND)
    }

    const order = await this.paymentService.createOrder(booking.totalPrice);

    await this.paymentRepo.create({
      bookingId,
      userId:booking.userId,
      razorpayOrderId: order.id,
      amount: booking.totalPrice,
      currency:order.currency,
      status: PaymentStatus.PENDING,
      mode: PaymentMode.RAZORPAY,
    });

    const data= toCreateOrder(order)
    return {data}
  }
}