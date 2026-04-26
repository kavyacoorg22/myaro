import { BookingAction } from "../../../domain/enum/bookingEnum";
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
import { IScheduleNotificationUseCase } from "../../interface/notification/IScheduleNotificationUseCase";
import { IVerifyPaymentUsecase } from "../../interface/payment/IVerifyPaymentUseCase";
import {
  IVerifyPaymentOutPut,
  IVerifyPaymentUsecaseInput,
} from "../../interfaceType/paymentType";
import { toVerifyPayment } from "../../mapper/paymentMapper";
import { IPaymentService } from "../../serviceInterface/IPaymentServie";
import {
  NotificationCategory,
  NotificationType,
} from "../../../domain/enum/notificationEnum";
import { toDateOnly } from "../../../utils/schedule/dateHelper";
import { paymentMessages } from "../../../shared/constant/message/paymentMessage";
import { bookingMessages } from "../../../shared/constant/message/bookingMessage";

export class VerifyPaymentUsecase implements IVerifyPaymentUsecase {
  constructor(
    private _paymentRepo: IPaymentRepository,
    private _bookingRepo: IBookingRepository,
    private _paymentService: IPaymentService,
    private _blockSlotUC: IBlockBookedSlotUSeCase,
    private _updateBookingStatusUC: IUpdateBookingStatusUseCase,
    private _scheduleNotification: IScheduleNotificationUseCase,
  ) {}
  async execute(
    data: IVerifyPaymentUsecaseInput,
  ): Promise<IVerifyPaymentOutPut> {
    const isValid = this._paymentService.verifySignature(data);

    if (!isValid) {
      await this._paymentRepo.updateByRazorpayOrderId(data.razorpay_order_id, {
        status: PaymentStatus.FAILED,
      });
      throw new AppError(
        paymentMessages.ERROR.INVALID_PAYMENT_SIGNATURE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payment = await this._paymentRepo.updateByRazorpayOrderId(
      data.razorpay_order_id,
      {
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
        status: PaymentStatus.PAID,
      },
    );
    if (!payment)
      throw new AppError(paymentMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    const booking = await this._bookingRepo.findById(payment.bookingId);
    if (!booking)
      throw new AppError(bookingMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

    const lockKey = `payment_lock:${payment.bookingId}`;
    const storedValue = await redisClient.get(lockKey);
    if (storedValue) {
      await releaseLock(lockKey, storedValue);
    }

    await this._updateBookingStatusUC.execute({
      bookingId: payment.bookingId,
      performedBy: booking.userId,
      role: UserRole.CUSTOMER,
      action: BookingAction.CONFIRM,
    });

    const [startTime, endTime] = booking.slot.time.split(" – ");
    await this._blockSlotUC.execute({
      beauticianId: booking.beauticianId,
      date: new Date(booking.slot.date),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    });

    const bookingDate = toDateOnly(new Date(booking.slot.date));
    // toDateOnly uses Date.UTC internally → always UTC midnight ✅

    bookingDate.setUTCHours(
      Math.floor(booking.slot.startMinutes / 60),
      booking.slot.startMinutes % 60,
      0,
      0,
    );

    const scheduledFor = new Date(bookingDate.getTime() - 24 * 60 * 60 * 1000);

    if (scheduledFor > new Date()) {
      await this._scheduleNotification.execute({
        userId: booking.userId,
        type: NotificationType.REMINDER,
        category: NotificationCategory.SYSTEM,
        title: "Upcoming Appointment",
        message: `Your appointment is tomorrow at ${startTime.trim()}`,
        metadata: { bookingId: booking.id },
        scheduledFor,
      });

      await this._scheduleNotification.execute({
        userId: booking.beauticianId,
        type: NotificationType.REMINDER,
        category: NotificationCategory.SYSTEM,
        title: "Upcoming Appointment",
        message: `You have an appointment tomorrow at ${startTime.trim()}`,
        metadata: { bookingId: booking.id },
        scheduledFor,
      });
    }
    const dto = toVerifyPayment(payment, true);
    return { data: dto };
  }
}
