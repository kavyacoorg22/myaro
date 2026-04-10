import { NextFunction, Request, Response } from "express";
import { ICreateOrderUsecase } from "../../../../application/interface/payment/ICreateOrderUseCase";
import { IVerifyPaymentUsecase } from "../../../../application/interface/payment/IVerifyPaymentUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IProcessRefundUseCase } from "../../../../application/interface/admin/management/booking/IProcessRefundUseCase";
import { IReleasePayoutUSeCase } from "../../../../application/interface/admin/management/booking/IReleasePayoutUsecase";

export class PaymentController{
  constructor(private createOrderUC:ICreateOrderUsecase,private verifyPaymentUC:IVerifyPaymentUsecase
    ,private processRefundUC:IProcessRefundUseCase,
    private releasePayoutUC:IReleasePayoutUSeCase
  ){}
  
  createOrder=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
       const bookingId=req.params.bookingId
      if(!bookingId)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }
      const result=await this.createOrderUC.execute({bookingId})
      res.status(HttpStatus.OK).json({
        success:true,
        message:"order returned",
        data:result.data
      })
    }catch(err)
    {
      next()
    }
  }

   verifyPayment=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

   const result= await this.verifyPaymentUC.execute({
      razorpay_order_id:   razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
    });

    res.status(HttpStatus.OK).json({ success: true, message: "payment verified",data:result.data });
    }catch(err)
    {
      next()
    }
  }
  processRefund=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
      const adminId=req.user?.id
      const {bookingId}=req.params
      const {adminNote}=req.body
      if(!adminId)
       {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
       }
       if(!bookingId)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }

      const result=await this.processRefundUC.execute({bookingId,adminId,adminNote})
      res.status(HttpStatus.OK).json({
        success:true,
        data:result.data
      })
    }catch(err)
    {
      next(err)
    }
           
  }

  releasePayout=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
          try{
      const adminId=req.user?.id
      const {bookingId}=req.params
      const {adminNote}=req.body
      if(!adminId)
       {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
       }
       if(!bookingId)
      {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST,HttpStatus.BAD_REQUEST)
      }

      const result=await this.releasePayoutUC.execute({bookingId,adminId,adminNote})
      res.status(HttpStatus.OK).json({
        success:true,
        data:result.data
      })
    }catch(err)
    {
      next(err)
    }
  }
}