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
import { PaymentStatus } from "../../../../domain/enum/paymentEnum";


export class BookingController{
  constructor(
  private getBeauticianBookingUseCase:IGetBeauticianBookingsUseCase,
  private createBookingUseCase:ICreateBookingUseCase,
  private updateBookingStatusUseCase:IUpdateBookingStatusUseCase,
  private getBookingByIdUseCase:IGetBookingByIdUseCase,
  private lockSlotUseCase:ILockSlotUSeCase,
  private requestRefundUC:IRequestRefundUseCase,
  private beauticianApproveRefundUC:IBeauticianApproveRefundUseCase,
  private disputeRefundUC:IDisputeRefundUseCase,
  private cancleBookingUC:ICancelBookingUseCase,
  private getAllBookingsUC:IGetAllBookingsUseCase,
  private getBookingDetailUC:IGetBookingDetailUseCase,
  private getAllDisputeUC:IGetAllDisputesUseCase,
  private getDisputeDetailUC:IGetDisputeDetailsUseCase,
  private getAllRefundUC:IGetAllRefundsUseCase,
  private getRefundDetailUC:IGetRefundDetailUseCase
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
 
      const booking = await this.beauticianApproveRefundUC.execute({
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

 cancelBooking=async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const userId=req.user?.id
      const {bookingId}=req.params
       if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
       if(!bookingId) throw new AppError(generalMessages.ERROR.BAD_REQUEST)
        const result=await this.cancleBookingUC.execute({bookingId,userId})

       res.status(HttpStatus.OK).json({
        success:true,
        data:result.data
       })

    }catch(err)
    {
      next(err)
    }
  }
  
 getAllBookingsForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {page,limit,paymentStatus}=req.query
       
        const result=await this.getAllBookingsUC.execute({
          page: page?parseInt(page as string):1,
          limit:limit?parseInt(limit as string):10,
          paymentStatus:paymentStatus as PaymentStatus|undefined
        })
     res.send(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
  
 getAllDisputeForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {page,limit}=req.query
       
        const result=await this.getAllDisputeUC.execute({
          page: page?parseInt(page as string):1,
          limit:limit?parseInt(limit as string):10,
        })
     res.send(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
  
 getAllRefunsForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {page,limit}=req.query
       
        const result=await this.getAllRefundUC.execute({
          page: page?parseInt(page as string):1,
          limit:limit?parseInt(limit as string):10,
        })
     res.status(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
  getBookingDetailForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {bookingId}=req.params
       
       if(!bookingId)
       {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
       }
       const result=await this.getBookingDetailUC.execute(bookingId)
     res.status(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
  getDisputeDetailForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {bookingId}=req.params
       
       if(!bookingId)
       {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
       }
       const result=await this.getDisputeDetailUC.execute(bookingId)
     res.status(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
  getRefundDetailForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {refundId}=req.params
       
       if(!refundId)
       {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
       }
       const result=await this.getRefundDetailUC.execute(refundId)
     res.status(HttpStatus.OK).json({
      sucesss:true,
      data:result.data
     })
    }catch(err)
    {
      next(err)
    }
 }
}