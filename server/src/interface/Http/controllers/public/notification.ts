import { NextFunction, Request, Response } from "express"
import { GetUserNotificationsUseCase } from "../../../../application/usecases/notification/IGetNotificationUseCase"
import { HttpStatus } from "../../../../shared/enum/httpStatus"
import { AppError } from "../../../../domain/errors/appError"
import { authMessages } from "../../../../shared/constant/message/authMessages"
import { MarkAllNotificationsReadUseCase } from "../../../../application/usecases/notification/markAllNotificationRead"

export class NotificationController {
  constructor(private _getUserNotifications: GetUserNotificationsUseCase,private _markAllNotificationReadUC:MarkAllNotificationsReadUseCase) {}

   getNotifications=async(req: Request, res: Response,next:NextFunction): Promise<void>=> {
    try{
    const userId = req.user?.id 
    if(!userId)
      {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
      } 
    const result = await this._getUserNotifications.execute(userId)

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    })
  }catch(err)
  {
    next(err)
  }
  }
   markAllNotificationRead=async(req: Request, res: Response,next:NextFunction): Promise<void>=> {
    try{
    const userId = req.user?.id 
    if(!userId)
      {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
      } 
    const result = await this._markAllNotificationReadUC.execute(userId)

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    })
  }catch(err)
  {
    next(err)
  }
  }
}