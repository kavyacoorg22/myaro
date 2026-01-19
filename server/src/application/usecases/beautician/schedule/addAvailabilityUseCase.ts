import { Slot } from "../../../../domain/entities/schedule";
import { IScheduleRepository } from "../../../../domain/repositoryInterface/IScheduleRepository";
import { IAddAvailbilityUseCase } from "../../../interface/beautician/schedule/IAddAvailabilityUseCase";
import { IAddAvailabilityRequest } from "../../../interfaceType/scheduleType";

export class AddAvailabilityUseCase implements IAddAvailbilityUseCase {
  private _scheduleRepo: IScheduleRepository;
  constructor(scheduleRepo: IScheduleRepository) {
    this._scheduleRepo = scheduleRepo;
  }
  async execute(
    beauticianId: string,
    input: IAddAvailabilityRequest,
  ): Promise<void> {
    const { dates, slots } = input;
    for (const dateStr of dates) {
      const date = new Date(dateStr);

      const existingSchedule = await this._scheduleRepo.findByBeauticianAndDate(
        beauticianId,
        date,
      );

      if (existingSchedule) {
        const mergedSlots = this.mergeSlots(existingSchedule.slots, slots);

        await this._scheduleRepo.updateById(existingSchedule.id, {
          slots: mergedSlots,
        });
      } else {
        await this._scheduleRepo.create({
          beauticianId,
          date,
          slots,
        });
      }
    }
  }

  private mergeSlots(existingSlots: Slot[], newSlots: Slot[]): Slot[] {
    const combined = [...existingSlots, ...newSlots];

    const unique = new Map<string, Slot>();
    for (const slot of combined) {
      unique.set(`${slot.startTime}-${slot.endTime}`, slot);
    }

    return Array.from(unique.values()).sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
  }
}
