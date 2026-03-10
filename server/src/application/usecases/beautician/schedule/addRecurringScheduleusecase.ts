import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { ScheduleType } from "../../../../domain/enum/beauticianEnum";

import { IAddRecursionScheduleInput } from "../../../interfaceType/scheduleType";
import { getEffectiveEndDate } from "../../../../utils/schedule/RruleHelper";
import { carveLeaveFromAvailability, computeSplit } from "../../../../utils/schedule/recurringOverlapSplitter";

export class AddRecurringAvailabilityUseCase {
  constructor(
    private readonly recurringScheduleRepo: IReccuringScheduleRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(beauticianId: string, input: IAddRecursionScheduleInput): Promise<void> {
    const user = await this.userRepo.findByUserId(beauticianId);
    if (!user || user.role !== UserRole.BEAUTICIAN) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

      const startDate = new Date(input.startDate);
  if (isNaN(startDate.getTime())) {
    throw new AppError("Invalid startDate", HttpStatus.BAD_REQUEST);
  }

    const startDateStr = input.startDate instanceof Date
      ? input.startDate.toISOString().split("T")[0]
      : input.startDate;

    const endDateStr = input.endDate instanceof Date
      ? input.endDate.toISOString().split("T")[0]
      : input.endDate;

    const newEnd = getEffectiveEndDate({
      endType:   input.endType,
      endDate:   endDateStr,
      endCount:  input.endCount,
      startDate: startDateStr,
      rrule:     input.rrule,
    });

    const existing   = await this.recurringScheduleRepo.findByBeauticianId(beauticianId) ?? [];
    const availRules = existing.filter(r => r.type === ScheduleType.AVAILABILITY);
    const leaveRules = existing.filter(r => r.type === ScheduleType.LEAVE);

    // Step 1: Split any overlapping availability rules
    for (const rule of availRules) {
      const result = computeSplit(rule, input.startDate, newEnd);
      if (!result) continue;
      await this.recurringScheduleRepo.deleteById(result.deleteId);
      for (const seg of result.segments) {
        await this.recurringScheduleRepo.create({ beauticianId, ...seg });
      }
    }

    // Step 2: Carve existing leave windows out of the new availability — leave wins
    const newAvailSegment = {
      rrule:     input.rrule,
      timeFrom:  input.timeFrom,
      timeTo:    input.timeTo,
      type:      input.type,
      startDate: input.startDate instanceof Date ? input.startDate : new Date(input.startDate),
      endType:   input.endType,
      endDate:   input.endDate
        ? (input.endDate instanceof Date ? input.endDate : new Date(input.endDate))
        : undefined,
      endCount:  input.endCount,
    };

    const toSave = leaveRules.length > 0
      ? carveLeaveFromAvailability(newAvailSegment, leaveRules)
      : [newAvailSegment];

    // Step 3: Save only portions that don't conflict with leave
    for (const seg of toSave) {
      await this.recurringScheduleRepo.create({ beauticianId, ...seg });
    }
  }
}