import { NextFunction, Request, Response } from "express";
import { IAddAvailbilityUseCase } from "../../../../application/interface/beautician/schedule/IAddAvailabilityUseCase";
import { IDeleteAvailbilitySlotUseCase } from "../../../../application/interface/beautician/schedule/IDeleteAvailabilitySlotUSeCase";
import { IGetAvailbilityUseCase } from "../../../../application/interface/beautician/schedule/IGetAvailabilityUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { ScheduleType } from "../../../../domain/enum/beauticianEnum";
import { IAddRecursionScheduleUseCase } from "../../../../application/interface/beautician/schedule/IAddRecurringSchedule";
import { IAddRecurringLeaveScheduleUseCase } from "../../../../application/interface/beautician/schedule/IAddRecurringLeaveSchedule";
import { IDeleteRecurringAvailabilitySlotUseCase } from "../../../../application/interface/beautician/schedule/IDeleteRecurringAvailabilitySlotUseCase";
import { IGetMonthlyAvailabilityUSeCase } from "../../../../application/interface/beautician/schedule/IGetMonthlyAvailabilityUseCase";

export class ScheduleController {
  private _addAvailabilityUC: IAddAvailbilityUseCase;
  private _deleteAvailabilitySlotUC: IDeleteAvailbilitySlotUseCase;
  private _getAvailabilityUC: IGetAvailbilityUseCase;

  constructor(
    addAvailabilityUC: IAddAvailbilityUseCase,
    deleteAvailabilitySlotUC: IDeleteAvailbilitySlotUseCase,
    getAvailabilityUC: IGetAvailbilityUseCase,
    private addRecurringAvailabilityUseCase: IAddRecursionScheduleUseCase,
    private addRecurringLeaveUseCase: IAddRecurringLeaveScheduleUseCase,
    private deleteRecurringSlotUC: IDeleteRecurringAvailabilitySlotUseCase,
    private getMonthlyAvailabilityUC: IGetMonthlyAvailabilityUSeCase,
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
      const { dates, slots, type } = req.body;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const input = { dates, slots, type };
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
      const { slotToDelete, source } = req.body;
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

  deleteRecurringAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const recurringId = req.params.id;
      const { date } = req.body;
    
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!recurringId || !date) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.deleteRecurringSlotUC.execute(beauticianId, {
        recurringId,
        date: new Date(date),
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Recurring slot removed for this date",
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
      if (typeof dateParam !== "string") {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const date = new Date(dateParam);
      date.setUTCHours(0, 0, 0, 0);
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
      if (typeof dateParam !== "string") {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const date = new Date(dateParam);
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

  addRecurringSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      try {
        const beauticianId = req.user?.id;
        const input = req.body;

        if (!beauticianId) {
          throw new AppError(
            authMessages.ERROR.UNAUTHORIZED,
            HttpStatus.UNAUTHORIZED,
          );
        }

        if (input.type === ScheduleType.LEAVE) {
          await this.addRecurringLeaveUseCase.execute(beauticianId, input);
        } else {
          await this.addRecurringAvailabilityUseCase.execute(
            beauticianId,
            input,
          );
        }

        res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: "Schedule added successfully" });
      } catch (error) {
        next(error);
      }
    } catch (err) {
      next(err);
    }
  };
 getMonthAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { month, year } = req.query;
 
    const beauticianId = req.params.id ?? req.user?.id;
   

    if (!beauticianId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    if (!month || !year) throw new AppError(generalMessages.ERROR.BAD_REQUEST, HttpStatus.BAD_REQUEST);

    const data = await this.getMonthlyAvailabilityUC.execute(
      beauticianId,
      Number(month),
      Number(year)
    );

    res.status(HttpStatus.OK).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
}
