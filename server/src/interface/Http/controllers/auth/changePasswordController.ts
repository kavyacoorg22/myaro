import { NextFunction, Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../../application/interface/auth/IChangePassword";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class ChangePasswordController{
  constructor(private readonly _ChangePasswordUC:IChangePasswordUseCase){}

 async handle(req:Request,res:Response,next:NextFunction)
  {
    try{
       const id=req.user?.id
        const {oldPassword,newPassword}=req.body.input
       if(!id)
       {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
       }
      
       await this._ChangePasswordUC.execute(id,{oldPassword,newPassword})
     
       return res.status(HttpStatus.OK).json({
        success:true,
        message:"Password Changed successfully"
       })

    }catch(err)
    {
     next(err)
    }
  }
}