import { ScheduleType } from "../../../../domain/enum/beauticianEnum";
import { IGetmonthlyAvailabilityDto } from "../../../dtos/beautician";
import { IGetAvailbilityUseCase } from "../../../interface/beautician/schedule/IGetAvailabilityUseCase";
import { IGetMonthlyAvailabilityUSeCase } from "../../../interface/beautician/schedule/IGetMonthlyAvailabilityUseCase";
import { IGetmonthlyAvailabilityOutput } from "../../../interfaceType/scheduleType";
import { toGetMonthlyAvailabilityDto } from "../../../mapper/scheduleMapper";


export class GetMonthlyAvailabilityUseCase implements IGetMonthlyAvailabilityUSeCase{

  constructor(private _getAvailabilityUC:IGetAvailbilityUseCase){}
 async execute(beauticianId: string, month: number, year: number): Promise<IGetmonthlyAvailabilityOutput> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates: IGetmonthlyAvailabilityDto[] = [];

  await Promise.all(
    Array.from({ length: daysInMonth }, async (_, i) => {
      const date = new Date(Date.UTC(year, month - 1, i + 1));
      const { availability } = await this._getAvailabilityUC.execute(beauticianId, date);

      if (availability.type === ScheduleType.LEAVE) {
        dates.push(toGetMonthlyAvailabilityDto(availability.date, ScheduleType.LEAVE));
      } else if (availability.slots.length > 0) {
        dates.push(toGetMonthlyAvailabilityDto(availability.date, ScheduleType.AVAILABILITY));
      }
    })
  );

  return { dates };
}
}