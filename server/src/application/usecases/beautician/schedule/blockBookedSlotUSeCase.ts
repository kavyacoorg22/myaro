import { Slot } from "../../../../domain/entities/schedule";
import {
  scheduleSourceType,
  ScheduleType,
} from "../../../../domain/enum/beauticianEnum";
import { IRecurringExceptionRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringExceptionRespository";
import { IScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IScheduleRepository";
import {
  minutesToTime,
  timeToMinutes,
  toDateOnly,
} from "../../../../utils/schedule/dateHelper";
import { IBlockBookedSlotUSeCase } from "../../../interface/beautician/schedule/IBlockBookedSlotUSeCase";
import { IBlockBookedSlotInput } from "../../../interfaceType/scheduleType";
import { GetAvailabilityUseCase } from "./getAvailableUSeCase";

export class BlockBookedSlotUseCase implements IBlockBookedSlotUSeCase {
  constructor(
    private _scheduleRepo: IScheduleRepository,
    private _recurringExceptionRepo: IRecurringExceptionRepository,
    private _getAvailabilityUC: GetAvailabilityUseCase,
  ) {}

  async execute(input: IBlockBookedSlotInput): Promise<void> {
    const { beauticianId, date, startTime, endTime } = input;

    const bookedStart = timeToMinutes(startTime);
    const bookedEnd = timeToMinutes(endTime);

    const { availability } = await this._getAvailabilityUC.execute(
      beauticianId,
      date,
    );

    if (!availability.slots?.length) return;

    const carved = this.carveOut(availability.slots, bookedStart, bookedEnd);

    if (availability.source === scheduleSourceType.MANUAL) {
      await this._scheduleRepo.updateById(availability.scheduleId, {
        slots: carved,
      });
    } else {
      const dateOnly = toDateOnly(date);

      await this._recurringExceptionRepo.create({
        recurringId: availability.scheduleId,
        beauticianId,
        date: dateOnly,
      });

      if (carved.length > 0) {
        await this._scheduleRepo.create({
          beauticianId,
          date: dateOnly,
          slots: carved,
          type: ScheduleType.AVAILABILITY,
        });
      }
    }
  }

  private carveOut(
    slots: Slot[],
    bookedStart: number,
    bookedEnd: number,
  ): Slot[] {
    const result: Slot[] = [];

    for (const slot of slots) {
      const sStart = timeToMinutes(slot.startTime);
      const sEnd = timeToMinutes(slot.endTime);

      if (bookedEnd <= sStart || bookedStart >= sEnd) {
        result.push(slot);
        continue;
      }
      if (sStart < bookedStart) {
        result.push({
          startTime: slot.startTime,
          endTime: minutesToTime(bookedStart),
        });
      }
      if (sEnd > bookedEnd) {
        result.push({
          startTime: minutesToTime(bookedEnd),
          endTime: slot.endTime,
        });
      }
    }

    return result;
  }
}
