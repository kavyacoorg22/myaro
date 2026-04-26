import { IScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IScheduleRepository";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import {
  scheduleSourceType,
  ScheduleType,
} from "../../../../domain/enum/beauticianEnum";
import { IGetAvailbilityUseCase } from "../../../interface/beautician/schedule/IGetAvailabilityUseCase";
import { IGetAvailabilitySlotResponse } from "../../../interfaceType/scheduleType";
import { toGetAvailabilitySlotDto } from "../../../mapper/scheduleMapper";
import { IRecurringExceptionRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringExceptionRespository";
import { toDateOnly } from "../../../../utils/schedule/dateHelper";
import { rruleCoversDate } from "../../../../utils/schedule/RruleHelper";

export class GetAvailabilityUseCase implements IGetAvailbilityUseCase {
  constructor(
    private readonly _scheduleRepo: IScheduleRepository,
    private readonly _recurringScheduleRepo: IReccuringScheduleRepository,
    private readonly _recurringExceptionRepo: IRecurringExceptionRepository,
  ) {}

  async execute(
    beauticianId: string,
    date: Date,
  ): Promise<IGetAvailabilitySlotResponse> {
    const dateOnly = toDateOnly(date);

    const oneTime = await this._scheduleRepo.findByBeauticianAndDate(
      beauticianId,
      dateOnly,
    );

    if (oneTime?.type === ScheduleType.LEAVE) {
      return {
        availability: {
          scheduleId: oneTime.id,
          slots: [],
          date: dateOnly,
          source: scheduleSourceType.MANUAL,
          type: ScheduleType.LEAVE,
        },
      };
    }

    if (oneTime?.type === ScheduleType.AVAILABILITY) {
      return {
        availability: {
          ...toGetAvailabilitySlotDto(oneTime, scheduleSourceType.MANUAL),
          source: scheduleSourceType.MANUAL,
        },
      };
    }

    const allRecurring =
      (await this._recurringScheduleRepo.findByBeauticianId(beauticianId)) ??
      [];

    const recurringLeave = allRecurring
      .filter((r) => r.type === ScheduleType.LEAVE)
      .find((r) => rruleCoversDate(r, dateOnly));

    if (recurringLeave) {
      return {
        availability: {
          scheduleId: recurringLeave.id,
          slots: [],
          date: dateOnly,
          source: scheduleSourceType.RECURRING,
          type: ScheduleType.LEAVE,
        },
      };
    }

    const matchingRecurring = allRecurring
      .filter((r) => r.type === ScheduleType.AVAILABILITY)
      .filter((r) => {
        const covers = rruleCoversDate(r, dateOnly);
        return covers;
      });

    if (matchingRecurring.length === 0) {
      return {
        availability: {
          scheduleId: "",
          slots: [],
          date: dateOnly,
          source: scheduleSourceType.RECURRING,
          type: ScheduleType.AVAILABILITY,
        },
      };
    }

    const exceptions =
      await this._recurringExceptionRepo.findByBeauticianAndDate(
        beauticianId,
        dateOnly,
      );

    const deletedRuleIds = new Set(exceptions.map((e) => e.recurringId));
    const activeRecurring = matchingRecurring.filter(
      (r) => !deletedRuleIds.has(r.id),
    );

    if (activeRecurring.length === 0) {
      return {
        availability: {
          scheduleId: "",
          slots: [],
          date: dateOnly,
          source: scheduleSourceType.RECURRING,
          type: ScheduleType.AVAILABILITY,
        },
      };
    }

    const mergedSlots = activeRecurring.map((r) => ({
      startTime: r.timeFrom,
      endTime: r.timeTo,
    }));

    return {
      availability: {
        scheduleId: activeRecurring[0].id,
        slots: mergedSlots,
        date: dateOnly,
        source: "recurring" as scheduleSourceType,
        type: ScheduleType.AVAILABILITY,
      },
    };
  }
}
