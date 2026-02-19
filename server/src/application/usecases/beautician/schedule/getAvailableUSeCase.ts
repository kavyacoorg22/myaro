import { IScheduleRepository } from "../../../../domain/repositoryInterface/IScheduleRepository";
import { IGetAvailbilityUseCase } from "../../../interface/beautician/schedule/IGetAvailabilityUseCase";
import { IGetAvailabilitySlotResponse } from "../../../interfaceType/scheduleType";
import { toGetAvailabilitySlotDto } from "../../../mapper/scheduleMapper";

export class GetAvaialableUseCase implements IGetAvailbilityUseCase {
  private _scheduleRepo: IScheduleRepository;
  constructor(scheduleRepo: IScheduleRepository) {
    this._scheduleRepo = scheduleRepo;
  }

  async execute(
    beauticianId: string,
    date: Date,
  ): Promise<IGetAvailabilitySlotResponse> {
    console.log('usecase reached.....')
    const schedule = await this._scheduleRepo.findByBeauticianAndDate(
      beauticianId,
      date,
    );
    console.log(schedule)

    if (!schedule) {
      return {
        availability: {
          scheduleId:'',
          slots: [],
          date,
        },
      };
    }
    console.log(schedule)
    const mapped = toGetAvailabilitySlotDto(schedule);
    return {
      availability: mapped,
    };
  }
}
