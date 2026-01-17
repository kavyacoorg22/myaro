import { NextFunction, Request, Response } from "express";
import { IAddCustomServiceUseCase } from "../../../../application/interface/admin/management/services/IAddCustomService";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class CustomServiceController {
  private _addCustomServiceUC:IAddCustomServiceUseCase
  
  constructor(addCustomService:IAddCustomServiceUseCase)
  {
    this._addCustomServiceUC=addCustomService
   
  }
  addCustomService= async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
       const beauticianId=req.user?.id
       if(!beauticianId)
       {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
       }
       const data={
        ...req.body,
        beauticianId,
       }

       await this._addCustomServiceUC.execute(data)
     res.status(HttpStatus.CREATED).json({
      success:true,
      message:"custom service created"
     })
    }catch(err)
    {
      next(err)
    }

  }

 
}

  //  getBeauticianServiceSelection= async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {}catch(err)
  //   {
  //     next(err)
  //   }

  // }