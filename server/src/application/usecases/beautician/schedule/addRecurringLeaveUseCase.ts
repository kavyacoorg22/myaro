import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { computeSplit } from "../../../../utils/schedule/recurringOverlapSplitter";
import { getEffectiveEndDate } from "../../../../utils/schedule/RruleHelper";
import { IAddRecurringLeaveScheduleUseCase } from "../../../interface/beautician/schedule/IAddRecurringLeaveSchedule";

import { IAddRecursionScheduleInput } from "../../../interfaceType/scheduleType";

export class AddRecurringLeaveUseCase implements IAddRecurringLeaveScheduleUseCase{
  constructor(
    private readonly recurringScheduleRepo: IReccuringScheduleRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(beauticianId: string, input: IAddRecursionScheduleInput): Promise<void> {
    const user = await this.userRepo.findByUserId(beauticianId);
    if (!user || user.role !== UserRole.BEAUTICIAN) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
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

    const existing = await this.recurringScheduleRepo.findByBeauticianId(beauticianId) ?? [];

    // Leave overrides everything — split both availability and leave rules that overlap
    for (const rule of existing) {
      const result = computeSplit(rule, input.startDate, newEnd);
      if (!result) continue;
      await this.recurringScheduleRepo.deleteById(result.deleteId);
      for (const seg of result.segments) {
        await this.recurringScheduleRepo.create({ beauticianId, ...seg });
      }
    }

    // Save the new leave rule as-is
    await this.recurringScheduleRepo.create({
      beauticianId,
      rrule:     input.rrule,
      timeFrom:  input.timeFrom,
      timeTo:    input.timeTo,
      type:      input.type,
      startDate: input.startDate,
      endType:   input.endType,
      endDate:   input.endDate,
      endCount:  input.endCount,
    });
  }
}