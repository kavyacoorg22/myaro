import { NextFunction ,Request,Response} from "express";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

import { ILogoutUseCase } from "../../../../application/interface/auth/logoutUseCase";

export class LogoutController{
  constructor(private logoutUseCase:ILogoutUseCase){}

  async handle(req:Request,res:Response,next:NextFunction){
    try{
         
        await this.logoutUseCase.execute(req,res)
     

   
    return res.status(HttpStatus.OK).json({
      success:true,
      message:authMessages.SUCCESS.LOGOUT,
    
    })
    }catch(err)
    {
      next(err)
    }
  }
}