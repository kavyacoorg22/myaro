import { Request, Response } from "express";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { BookingStatus } from "../../../../domain/enum/bookingEnum";
import { IGetBeauticianBookingsUseCase } from "../../../../application/interface/booking/IGetBeauticianBookingUseCase";
import { ICreateBookingUseCase } from "../../../../application/interface/booking/ICreateBooking";
import { IUpdateBookingStatusUseCase } from "../../../../application/interface/booking/IUpdateBookingStatusUSeCase";
import { IGetBookingByIdUseCase } from "../../../../application/interface/booking/IGetBookingById";
import { ILockSlotUSeCase } from "../../../../application/interface/booking/ILockSlotUseCase";
import { IRequestRefundUseCase } from "../../../../application/interface/booking/IRequestRefundUC";
import { IBeauticianApproveRefundUseCase } from "../../../../application/interface/booking/IBeauticianApproveRefundUseCase";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IDisputeRefundUseCase } from "../../../../application/interface/booking/IDisputeRefundUsecase";
import { ICancelBookingUseCase } from "../../../../application/interface/booking/ICancelBooking";
import { IGetAllBookingsUseCase } from "../../../../application/interface/admin/management/booking/IGetAllBookingsUseCase";
import { IGetBookingDetailUseCase } from "../../../../application/interface/admin/management/booking/IGetBookingDetailUseCase";
import { IGetAllDisputesUseCase } from "../../../../application/interface/admin/management/booking/IGetAllDisputesUseCase";
import { IGetDisputeDetailsUseCase } from "../../../../application/interface/admin/management/booking/IGetDisputeDetailUseCase";
import { IGetAllRefundsUseCase } from "../../../../application/interface/admin/management/booking/IgetAllRefundsUseCase";
import { IGetRefundDetailUseCase } from "../../../../application/interface/admin/management/booking/IGetRefundDetailUseCase";
import {
  PaymentStatus,
  RefundStatus,
} from "../../../../domain/enum/paymentEnum";
import { IGetCustomerBookingsUseCase } from "../../../../application/interface/booking/IGetCustomerBookings";
import { bookingMessages } from "../../../../shared/constant/message/bookingMessage";

export class BookingController {
  constructor(
    private _getBeauticianBookingUseCase: IGetBeauticianBookingsUseCase,
    private _createBookingUseCase: ICreateBookingUseCase,
    private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
    private _getBookingByIdUseCase: IGetBookingByIdUseCase,
    private _lockSlotUseCase: ILockSlotUSeCase,
    private _requestRefundUseCase: IRequestRefundUseCase,
    private _beauticianApproveRefundUseCase: IBeauticianApproveRefundUseCase,
    private _disputeRefundUseCase: IDisputeRefundUseCase,
    private _cancleBookingUseCase: ICancelBookingUseCase,
    private _getAllBookingsUseCase: IGetAllBookingsUseCase,
    private _getBookingDetailUseCase: IGetBookingDetailUseCase,
    private _getAllDisputeUseCase: IGetAllDisputesUseCase,
    private _getDisputeDetailUseCase: IGetDisputeDetailsUseCase,
    private _getAllRefundUseCase: IGetAllRefundsUseCase,
    private _getRefundDetailUseCase: IGetRefundDetailUseCase,
    private _getCustomerBookingsUseCase: IGetCustomerBookingsUseCase,
  ) {}

  createBooking = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const {
      chatId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot,
      clientNote,
    } = req.body;

    const booking = await this._createBookingUseCase.execute({
      chatId,
      userId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot,
      clientNote,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: bookingMessages.SUCCESS.CREATED,
      data: booking,
    });
  };

  getBeauticianBookings = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { status, page, limit } = req.query;

    const result = await this._getBeauticianBookingUseCase.execute({
      beauticianId,
      status: status as BookingStatus | undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.LIST_FETCHED,
      data: result,
    });
  };

  getUserBookings = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { status, page, limit } = req.query;

    const result = await this._getCustomerBookingsUseCase.execute({
      userId,
      status: status as BookingStatus | undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.LIST_FETCHED,
      data: result,
    });
  };

  getBookingById = async (req: Request, res: Response): Promise<void> => {
    const requesterId = req.user?.id;
    if (!requesterId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { bookingId } = req.params;

    const booking = await this._getBookingByIdUseCase.execute(
      bookingId,
      requesterId,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.FETCHED,
      data: booking,
    });
  };

  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    const performedBy = req.user?.id;
    if (!performedBy)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { bookingId } = req.params;
    const { action, rejectionReason, role } = req.body;

    const booking = await this._updateBookingStatusUseCase.execute({
      bookingId,
      performedBy,
      role,
      action,
      rejectionReason,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.STATUS_UPDATED,
      data: booking,
    });
  };

  lockSlot = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { beauticianId, date, startTime, endTime } = req.body;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const result = await this._lockSlotUseCase.execute({
      beauticianId,
      date,
      startTime,
      endTime,
      userId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.SLOT_RESERVED,
      data: result,
    });
  };

  requestRefund = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { bookingId } = req.params;
    const { refundReason } = req.body;
    if (!refundReason || !bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const booking = await this._requestRefundUseCase.execute({
      bookingId,
      userId,
      refundReason,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.REFUND_REQUESTED,
      data: booking,
    });
  };

  approveRefund = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { bookingId } = req.params;

    const booking = await this._beauticianApproveRefundUseCase.execute({
      bookingId,
      beauticianId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.REFUND_APPROVED,
      data: booking,
    });
  };

  disputeRefund = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const { bookingId } = req.params;
    const { disputeReason } = req.body;

    if (!disputeReason) throw new AppError(generalMessages.ERROR.BAD_REQUEST);

    const booking = await this._disputeRefundUseCase.execute({
      bookingId,
      beauticianId,
      disputeReason,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.REFUND_DISPUTED,
      data: booking,
    });
  };

  cancelBooking = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    if (!userId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    if (!bookingId) throw new AppError(generalMessages.ERROR.BAD_REQUEST);
    const result = await this._cancleBookingUseCase.execute({
      bookingId,
      userId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.CANCELLED,
      data: result.data,
    });
  };

  getAllBookingsForAdmin = async (req: Request, res: Response) => {
    const { page, limit, paymentStatus } = req.query;

    const result = await this._getAllBookingsUseCase.execute({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      paymentStatus: paymentStatus as PaymentStatus | undefined,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.LIST_FETCHED,
      data: result,
    });
  };

  getAllDisputeForAdmin = async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    const result = await this._getAllDisputeUseCase.execute({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.DISPUTES_FETCHED,
      data: result,
    });
  };

  getAllRefunsForAdmin = async (req: Request, res: Response) => {
    const { page, limit, status } = req.query;
    const result = await this._getAllRefundUseCase.execute({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      status: status as RefundStatus,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.REFUNDS_FETCHED,
      data: result.data,
    });
  };

  getBookingDetailForAdmin = async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    if (!bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this._getBookingDetailUseCase.execute(bookingId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.FETCHED,
      data: result.data,
    });
  };

  getDisputeDetailForAdmin = async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    if (!bookingId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this._getDisputeDetailUseCase.execute(bookingId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.DISPUTE_FETCHED,
      data: result.data,
    });
  };

  getRefundDetailForAdmin = async (req: Request, res: Response) => {
    const { refundId } = req.params;

    if (!refundId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this._getRefundDetailUseCase.execute(refundId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: bookingMessages.SUCCESS.REFUND_FETCHED,
      data: result.data,
    });
  };
}
