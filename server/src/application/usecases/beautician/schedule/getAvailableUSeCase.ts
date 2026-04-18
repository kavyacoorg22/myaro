import { IScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IScheduleRepository";
import { IReccuringScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { scheduleSourceType, ScheduleType } from "../../../../domain/enum/beauticianEnum";
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
    console.log('[GetAvailability] beauticianId:', beauticianId, '| dateOnly:', dateOnly);

    const oneTime = await this._scheduleRepo.findByBeauticianAndDate(beauticianId, dateOnly);
    console.log('[GetAvailability] oneTime:', oneTime);

    if (oneTime?.type === ScheduleType.LEAVE) {
      console.log('[GetAvailability] → one-time LEAVE');
      return { availability: { scheduleId: oneTime.id, slots: [], date: dateOnly, source: scheduleSourceType.MANUAL ,    type:ScheduleType.LEAVE,} };
    }

    if (oneTime?.type === ScheduleType.AVAILABILITY) {
      console.log('[GetAvailability] → one-time AVAILABILITY, slots:', oneTime);
      return { availability: { ...toGetAvailabilitySlotDto(oneTime,scheduleSourceType.MANUAL), source: scheduleSourceType.MANUAL } };
    }

    const allRecurring = (await this._recurringScheduleRepo.findByBeauticianId(beauticianId)) ?? [];
    console.log('[GetAvailability] allRecurring count:', allRecurring.length);
    console.log('[GetAvailability] allRecurring:', JSON.stringify(allRecurring.map(r => ({ id: r.id, type: r.type, startDate: r.startDate, endDate: r.endDate, rrule: r.rrule }))));

    const recurringLeave = allRecurring
      .filter((r) => r.type === ScheduleType.LEAVE)
      .find((r) => rruleCoversDate(r, dateOnly));

    if (recurringLeave) {
      console.log('[GetAvailability] → recurring LEAVE');
      return { availability: { scheduleId: recurringLeave.id, slots: [], date: dateOnly, source: scheduleSourceType.RECURRING,    type:       ScheduleType.LEAVE } };
    }

    const matchingRecurring = allRecurring
      .filter((r) => r.type === ScheduleType.AVAILABILITY)
      .filter((r) => {
        const covers = rruleCoversDate(r, dateOnly);
        console.log(`[GetAvailability] rule ${r.id} covers date? ${covers} | rrule: ${r.rrule} | startDate: ${r.startDate}`);
        return covers;
      });

    console.log('[GetAvailability] matchingRecurring count:', matchingRecurring.length);

    if (matchingRecurring.length === 0) {
      console.log('[GetAvailability] → no matching recurring rules');
      return { availability: { scheduleId: '', slots: [], date: dateOnly, source: scheduleSourceType.RECURRING ,    type:       ScheduleType.AVAILABILITY} };
    }

    const exceptions = await this._recurringExceptionRepo.findByBeauticianAndDate(beauticianId, dateOnly);
    console.log('[GetAvailability] exceptions:', exceptions);

    const deletedRuleIds = new Set(exceptions.map((e) => e.recurringId));
    const activeRecurring = matchingRecurring.filter((r) => !deletedRuleIds.has(r.id));
    console.log('[GetAvailability] activeRecurring count:', activeRecurring.length);

    if (activeRecurring.length === 0) {
      console.log('[GetAvailability] → all recurring rules deleted for this date');
      return { availability: { scheduleId: '', slots: [], date: dateOnly, source: scheduleSourceType.RECURRING,    type:       ScheduleType.AVAILABILITY } };
    }

    const mergedSlots = activeRecurring.map((r) => ({ startTime: r.timeFrom, endTime: r.timeTo }));
    console.log('[GetAvailability] → returning slots:', mergedSlots);

    return {
      availability: {
        scheduleId: activeRecurring[0].id,
        slots: mergedSlots,
        date: dateOnly,
        source: 'recurring' as scheduleSourceType,
            type:       ScheduleType.AVAILABILITY,
      },
    };
  }
}