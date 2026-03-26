import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { BookingStatus } from "../../../../domain/enum/bookingEnum";
import { IGetBeauticianBookingsUseCase } from "../../../../application/interface/booking/IGetBeauticianBookingUseCase";
import { ICreateBookingUseCase } from "../../../../application/interface/booking/ICreateBooking";
import { IUpdateBookingStatusUseCase } from "../../../../application/interface/booking/IUpdateBookingStatusUSeCase";
import { IGetBookingByIdUseCase } from "../../../../application/interface/booking/IGetBookingById";


export class BookingController{
  constructor(
  private getBeauticianBookingUseCase:IGetBeauticianBookingsUseCase,
  private createBookingUseCase:ICreateBookingUseCase,
  private updateBookingStatusUseCase:IUpdateBookingStatusUseCase,
  private getBookingByIdUseCase:IGetBookingByIdUseCase
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
}