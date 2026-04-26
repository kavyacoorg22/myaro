import { Request, Response } from "express";
import { GetUserNotificationsUseCase } from "../../../../application/usecases/notification/IGetNotificationUseCase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { MarkAllNotificationsReadUseCase } from "../../../../application/usecases/notification/markAllNotificationRead";
import { notificationMessages } from "../../../../shared/constant/message/notificationMessage";

export class NotificationController {
  constructor(
    private _getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private _markAllNotificationReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  getNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const result = await this._getUserNotificationsUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: notificationMessages.SUCCESS.FETCHED,
      data: result,
    });
  };

  markAllNotificationRead = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const result = await this._markAllNotificationReadUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: notificationMessages.SUCCESS.MARKED_ALL_READ,
      data: result,
    });
  };
}