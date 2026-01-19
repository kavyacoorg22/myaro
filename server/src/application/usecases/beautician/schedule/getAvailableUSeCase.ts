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
    const schedule = await this._scheduleRepo.findByBeauticianAndDate(
      beauticianId,
      date,
    );
    if (!schedule) {
      return {
        availability: {
          slots: [],
          date,
        },
      };
    }
    const mapped = toGetAvailabilitySlotDto(schedule);
    return {
      availability: mapped,
    };
  }
}
