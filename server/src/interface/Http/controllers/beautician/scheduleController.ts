import { NextFunction, Request, Response } from "express";
import { IAddAvailbilityUseCase } from "../../../../application/interface/beautician/schedule/IAddAvailabilityUseCase";
import { IDeleteAvailbilitySlotUseCase } from "../../../../application/interface/beautician/schedule/IDeleteAvailabilitySlotUSeCase";
import { IGetAvailbilityUseCase } from "../../../../application/interface/beautician/schedule/IGetAvailabilityUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class ScheduleController {
  private _addAvailabilityUC: IAddAvailbilityUseCase;
  private _deleteAvailabilitySlotUC: IDeleteAvailbilitySlotUseCase;
  private _getAvailabilityUC: IGetAvailbilityUseCase;

  constructor(
    addAvailabilityUC: IAddAvailbilityUseCase,
    deleteAvailabilitySlotUC: IDeleteAvailbilitySlotUseCase,
    getAvailabilityUC: IGetAvailbilityUseCase,
  ) {
    ((this._addAvailabilityUC = addAvailabilityUC),
      (this._deleteAvailabilitySlotUC = deleteAvailabilitySlotUC),
      (this._getAvailabilityUC = getAvailabilityUC));
  }

  addAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const { dates, slots } = req.body;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const input = { dates, slots };
      await this._addAvailabilityUC.execute(beauticianId, input);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Schedule added",
      });
    } catch (err) {
      next(err);
    }
  };
  deleteAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const scheduleId = req.params.id;
      const slotToDelete = req.body;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!scheduleId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this._deleteAvailabilitySlotUC.execute(
        beauticianId,
        scheduleId,
        slotToDelete,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Schedule deleted",
      });
    } catch (err) {
      next(err);
    }
  };
  getAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;

      const dateParam = req.query.date;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
       if(typeof dateParam!=='string')
      {
         throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
        const date = new Date(dateParam)
      const data = await this._getAvailabilityUC.execute(beauticianId, date);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Schedule data returned",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  getAvailabilityForUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.params.id;

      const dateParam = req.query.date;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if(typeof dateParam!=='string')
      {
         throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
        const date = new Date(dateParam)
      const data = await this._getAvailabilityUC.execute(beauticianId, date);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Schedule data returned",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}
