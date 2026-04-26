import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { ScheduleType } from "../../../../domain/enum/beauticianEnum";
import { IAddRecursionScheduleUseCase } from "../../../interface/beautician/schedule/IAddRecurringSchedule";
import { IAddRecursionScheduleInput } from "../../../interfaceType/scheduleType";
import { getEffectiveEndDate } from "../../../../utils/schedule/RruleHelper";
import {
  carveLeaveFromAvailability,
  computeSplit,
} from "../../../../utils/schedule/recurringOverlapSplitter";
import { extractBYDAY } from "../../../../utils/schedule/dateHelper";
import { scheduleMessages } from "../../../../shared/constant/message/scheduleMessage";

export class AddRecurringAvailabilityUseCase implements IAddRecursionScheduleUseCase {
  constructor(
    private readonly _recurringScheduleRepo: IReccuringScheduleRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    beauticianId: string,
    input: IAddRecursionScheduleInput,
  ): Promise<void> {
    const user = await this._userRepo.findByUserId(beauticianId);
    if (!user || user.role !== UserRole.BEAUTICIAN) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    const startDate = new Date(input.startDate);
    if (isNaN(startDate.getTime())) {
      throw new AppError(
        scheduleMessages.ERROR.INVALID_DATE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const startDateStr =
      input.startDate instanceof Date
        ? input.startDate.toISOString().split("T")[0]
        : input.startDate;

    const endDateStr =
      input.endDate instanceof Date
        ? input.endDate.toISOString().split("T")[0]
        : input.endDate;

    const newEnd = getEffectiveEndDate({
      endType: input.endType,
      endDate: endDateStr,
      endCount: input.endCount,
      startDate: startDateStr,
      rrule: input.rrule,
    });

    const existing =
      (await this._recurringScheduleRepo.findByBeauticianId(beauticianId)) ??
      [];
    const availRules = existing.filter(
      (r) => r.type === ScheduleType.AVAILABILITY,
    );
    const leaveRules = existing.filter((r) => r.type === ScheduleType.LEAVE);

    // Step 1: Split any overlapping availability rules
    for (const rule of availRules) {
      const result = computeSplit(rule, input.startDate, newEnd);
      if (!result) continue;
      await this._recurringScheduleRepo.deleteById(result.deleteId);
      for (const seg of result.segments) {
        await this._recurringScheduleRepo.create({ beauticianId, ...seg });
      }
    }

    const newAvailSegment = {
      rrule: input.rrule,
      timeFrom: input.timeFrom,
      timeTo: input.timeTo,
      type: input.type,
      startDate:
        input.startDate instanceof Date
          ? input.startDate
          : new Date(input.startDate),
      endType: input.endType,
      endDate: input.endDate
        ? input.endDate instanceof Date
          ? input.endDate
          : new Date(input.endDate)
        : undefined,
      endCount: input.endCount,
    };

    // Step 2: Only carve leave rules that share the same days as the new availability
    //  e.g. BYDAY=SA should NOT be carved by BYDAY=TH,SU — different days, no real conflict
    const newDays = extractBYDAY(input.rrule);

    const conflictingLeaveRules = leaveRules.filter((leave) => {
      const leaveDays = extractBYDAY(leave.rrule);
      // if either rule has no BYDAY (e.g. FREQ=DAILY), treat as conflicting
      if (leaveDays.length === 0 || newDays.length === 0) return true;
      return leaveDays.some((d) => newDays.includes(d));
    });

    // Step 3: Save only portions that don't conflict with leave
    const toSave =
      conflictingLeaveRules.length > 0
        ? carveLeaveFromAvailability(newAvailSegment, conflictingLeaveRules)
        : [newAvailSegment];

    for (const seg of toSave) {
      await this._recurringScheduleRepo.create({ beauticianId, ...seg });
    }
  }
}
