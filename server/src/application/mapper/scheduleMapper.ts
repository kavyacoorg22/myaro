import { Schedule } from "../../domain/entities/schedule";
import { scheduleSourceType, ScheduleType } from "../../domain/enum/beauticianEnum";
import { IGetAvailabilitySlotDto, IGetmonthlyAvailabilityDto } from "../dtos/beautician";

export function toGetAvailabilitySlotDto(slot: Schedule, source: scheduleSourceType): IGetAvailabilitySlotDto {
  return {
    scheduleId: slot.id,
    slots: slot.slots,
    date: slot.date,
    type: slot.type,
    source, 
  };
}

export function toGetMonthlyAvailabilityDto(date: Date, type: ScheduleType): IGetmonthlyAvailabilityDto {
  return {
    date: new Date(date),
    type
  };
}
