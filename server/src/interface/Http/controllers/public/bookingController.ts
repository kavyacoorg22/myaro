import { NextFunction, Request, Response } from "express";
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
import { IApproveRefundUseCase } from "../../../../application/interface/booking/IApproveRefundUseCase";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IDisputeRefundUseCase } from "../../../../application/interface/booking/IDisputeRefundUsecase";


export class BookingController{
  constructor(
  private getBeauticianBookingUseCase:IGetBeauticianBookingsUseCase,
  private createBookingUseCase:ICreateBookingUseCase,
  private updateBookingStatusUseCase:IUpdateBookingStatusUseCase,
  private getBookingByIdUseCase:IGetBookingByIdUseCase,
  private lockSlotUseCase:ILockSlotUSeCase,
  private requestRefundUC:IRequestRefundUseCase,
  private approveRefundUC:IApproveRefundUseCase,
  private disputeRefundUC:IDisputeRefundUseCase
  ){}

  createBooking=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try{
       const userId = req.user?.id;
    if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const {
      chatId,
      beauticianId,
      services,
      totalPrice,
      address,
      phoneNumber,
      slot,
      clientNote
    } = req.body;

    const booking = await this.createBookingUseCase.execute({
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

    res.status(HttpStatus.CREATED).json({ success: true, data: booking });
   }catch(err)
   {
     next(err)
   }
  }
    getBeauticianBookings=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try{
      const beauticianId = req.user?.id;
    if (!beauticianId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const { status, page, limit } = req.query;

    const result = await this.getBeauticianBookingUseCase.execute({
      beauticianId,
      status: status as BookingStatus | undefined,
      page:   page   ? parseInt(page  as string) : 1,
      limit:  limit  ? parseInt(limit as string) : 10,
    });

    res.status(HttpStatus.OK).json({ success: true, data: result });
   }catch(err)
   {
    next(err)
   }
  }
    getBookingById=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try{
       const requesterId = req.user?.id;
    if (!requesterId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const { bookingId } = req.params;

    const booking = await this.getBookingByIdUseCase.execute(bookingId, requesterId);

    res.status(HttpStatus.OK).json({ success: true, data: booking });
   }catch(err)
   {
    next(err)
   }
  }
    updateBookingStatus=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
   try{
      const performedBy = req.user?.id;
    if (!performedBy) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

    const { bookingId } = req.params;
    const { action, rejectionReason, role } = req.body;

    const booking = await this.updateBookingStatusUseCase.execute({
      bookingId,
      performedBy,
      role,
      action,
      rejectionReason,
    });

    res.status(HttpStatus.OK).json({ success: true, data: booking });
   }catch(err)
   {
    next(err)
   }
  }
  lockSlot=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
   const userId = req.user?.id;
    const { beauticianId, date, startTime, endTime } = req.body;
    if(!userId)
    {
      throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
    }
    const result = await this.lockSlotUseCase.execute({
      beauticianId, date, startTime, endTime, userId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Slot reserved",
      data: result,  
    });
  }
   
  requestRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
 
      const { bookingId } = req.params;
      const { refundReason } = req.body;
      console.log(refundReason)
      if(!refundReason|| !bookingId)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }
 
      const booking = await this.requestRefundUC.execute({
        bookingId,
        userId,
        refundReason,
      });
 
      res.status(HttpStatus.OK).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  };

    approveRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      if (!beauticianId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
 
      const { bookingId } = req.params;
 
      const booking = await this.approveRefundUC.execute({
        bookingId,
        beauticianId,
      });
 
      res.status(HttpStatus.OK).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  };
    disputeRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      if (!beauticianId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
 
      const { bookingId } = req.params;
      const {disputeReason}=req.body

      if(!disputeReason) throw new AppError(generalMessages.ERROR.BAD_REQUEST)
 
      const booking = await this.disputeRefundUC.execute({
        bookingId,
        beauticianId,
        disputeReason
      });
 
      res.status(HttpStatus.OK).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  };
 
}