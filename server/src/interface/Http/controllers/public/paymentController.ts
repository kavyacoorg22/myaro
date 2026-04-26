import { Request, Response } from "express";
import { ICreateOrderUsecase } from "../../../../application/interface/payment/ICreateOrderUseCase";
import { IVerifyPaymentUsecase } from "../../../../application/interface/payment/IVerifyPaymentUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IProcessRefundUseCase } from "../../../../application/interface/admin/management/booking/IProcessRefundUseCase";
import { IReleasePayoutUSeCase } from "../../../../application/interface/admin/management/booking/IReleasePayoutUsecase";
import { IGetUserRefundSummeryUseCase } from "../../../../application/interface/customer/IGetUserRefundSummeryUseCase";
import { paymentMessages } from "../../../../shared/constant/message/paymentMessage";

export class PaymentController {
  constructor(
    private _createOrderUseCase: ICreateOrderUsecase,
    private _verifyPaymentUseCase: IVerifyPaymentUsecase,
    private _processRefundUseCase: IProcessRefundUseCase,
    private _releasePayoutUseCase: IReleasePayoutUSeCase,
    private _getUserRefundSummeryUseCase: IGetUserRefundSummeryUseCase,
  ) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this._createOrderUseCase.execute({ bookingId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: paymentMessages.SUCCESS.ORDER_CREATED,
      data: result.data,
    });
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const result = await this._verifyPaymentUseCase.execute({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: paymentMessages.SUCCESS.PAYMENT_VERIFIED,
      data: result.data,
    });
  };

  processRefund = async (req: Request, res: Response): Promise<void> => {
    const adminId = req.user?.id;
    const { bookingId } = req.params;
    const { adminNote } = req.body;
    if (!adminId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this._processRefundUseCase.execute({
      bookingId,
      adminId,
      adminNote,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: paymentMessages.SUCCESS.REFUND_PROCESSED,
      data: result.data,
    });
  };

  releasePayout = async (req: Request, res: Response): Promise<void> => {
    const adminId = req.user?.id;
    const { bookingId } = req.params;
    const { adminNote } = req.body;
    if (!adminId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this._releasePayoutUseCase.execute({
      bookingId,
      adminId,
      adminNote,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: paymentMessages.SUCCESS.PAYOUT_RELEASED,
      data: result.data,
    });
  };

  getUserRefundSummery = async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id;
    if (!id) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const result = await this._getUserRefundSummeryUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: paymentMessages.SUCCESS.REFUND_SUMMARY_FETCHED,
      data: result,
    });
  };
}
