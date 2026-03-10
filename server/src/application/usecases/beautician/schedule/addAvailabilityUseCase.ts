import { Slot } from "../../../../domain/entities/schedule";
import { ScheduleType } from "../../../../domain/enum/beauticianEnum";
import { IScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IScheduleRepository";
import { IAddAvailbilityUseCase } from "../../../interface/beautician/schedule/IAddAvailabilityUseCase";
import { IAddAvailabilityRequest } from "../../../interfaceType/scheduleType";
import { AppError } from "../../../../domain/errors/appError";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class AddAvailabilityUseCase implements IAddAvailbilityUseCase {
  private _scheduleRepo: IScheduleRepository;
  constructor(scheduleRepo: IScheduleRepository) {
    this._scheduleRepo = scheduleRepo;
  }

  async execute(
    beauticianId: string,
    input: IAddAvailabilityRequest,
  ): Promise<void> {
    const { dates, slots, type } = input;

    this.checkOverlap(slots);

    for (const dateStr of dates) {
      const date = new Date(dateStr);

      const existingSchedule = await this._scheduleRepo.findByBeauticianAndDate(
        beauticianId,
        date,
      );

      if (existingSchedule) {
        if (existingSchedule.type === ScheduleType.LEAVE) {
          throw new AppError(
            `Cannot add availability on ${dateStr} — it is marked as leave`,
            HttpStatus.CONFLICT,
          );
        }
        this.checkOverlap([...existingSchedule.slots, ...slots]);

        const mergedSlots = this.mergeSlots(existingSchedule.slots, slots);
        await this._scheduleRepo.updateById(existingSchedule.id, {
          slots: mergedSlots,
        });
      } else {
        await this._scheduleRepo.create({
          beauticianId,
          date,
          slots,
          type: type as ScheduleType,
        });
      }
    }
  }

  private checkOverlap(slots: Slot[]): void {
    const sorted = [...slots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      if (current.endTime > next.startTime) {
        throw new AppError(
          `Time slot ${current.startTime}–${current.endTime} overlaps with ${next.startTime}–${next.endTime}`,
          HttpStatus.BAD_REQUEST,
        );
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
