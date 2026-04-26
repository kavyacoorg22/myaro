import { Request, Response } from "express";
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
import { scheduleMessages } from "../../../../shared/constant/message/scheduleMessage";

export class ScheduleController {
  constructor(
    private _addAvailabilityUseCase: IAddAvailbilityUseCase,
    private _deleteAvailabilitySlotUseCase: IDeleteAvailbilitySlotUseCase,
    private _getAvailabilityUseCase: IGetAvailbilityUseCase,
    private _addRecurringAvailabilityUseCase: IAddRecursionScheduleUseCase,
    private _addRecurringLeaveUseCase: IAddRecurringLeaveScheduleUseCase,
    private _deleteRecurringSlotUseCase: IDeleteRecurringAvailabilitySlotUseCase,
    private _getMonthlyAvailabilityUseCase: IGetMonthlyAvailabilityUSeCase,
  ) {}

  addAvailability = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const { dates, slots, type } = req.body;
    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const input = { dates, slots, type };
    await this._addAvailabilityUseCase.execute(beauticianId, input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: scheduleMessages.SUCCESS.CREATED,
    });
  };
  deleteAvailability = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const scheduleId = req.params.id;
    const { slotToDelete } = req.body;
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

    await this._deleteAvailabilitySlotUseCase.execute(
      beauticianId,
      scheduleId,
      slotToDelete,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: scheduleMessages.SUCCESS.DELETED,
    });
  };

  deleteRecurringAvailability = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
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

    await this._deleteRecurringSlotUseCase.execute(beauticianId, {
      recurringId,
      date: new Date(date),
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: scheduleMessages.SUCCESS.RECURRING_DELETED,
    });
  };
  getAvailability = async (req: Request, res: Response): Promise<void> => {
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
    const data = await this._getAvailabilityUseCase.execute(beauticianId, date);

    res.status(HttpStatus.OK).json({
      success: true,
      message: scheduleMessages.SUCCESS.FETCHED,
      data: data,
    });
  };

  getAvailabilityForUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
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
    const data = await this._getAvailabilityUseCase.execute(beauticianId, date);

    res.status(HttpStatus.OK).json({
      success: true,
      message: scheduleMessages.SUCCESS.FETCHED,
      data: data,
    });
  };

  addRecurringSchedule = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const input = req.body;

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (input.type === ScheduleType.LEAVE) {
      await this._addRecurringLeaveUseCase.execute(beauticianId, input);
    } else {
      await this._addRecurringAvailabilityUseCase.execute(beauticianId, input);
    }

    res
      .status(HttpStatus.CREATED)
      .json({ success: true, message: scheduleMessages.SUCCESS.CREATED });
  };
  getMonthAvailability = async (req: Request, res: Response): Promise<void> => {
    const { month, year } = req.query;

    const beauticianId = req.params.id ?? req.user?.id;

    if (!beauticianId)
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    if (!month || !year)
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );

    const data = await this._getMonthlyAvailabilityUseCase.execute(
      beauticianId,
      Number(month),
      Number(year),
    );

    res
      .status(HttpStatus.OK)
      .json({
        success: true,
        message: scheduleMessages.SUCCESS.MONTH_FETCHED,
        data,
      });
  };
}
