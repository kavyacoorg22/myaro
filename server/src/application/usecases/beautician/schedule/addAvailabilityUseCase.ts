import { Slot } from "../../../../domain/entities/schedule";
import { ScheduleType } from "../../../../domain/enum/beauticianEnum";
import { IScheduleRepository } from "../../../../domain/repositoryInterface/beautician/IScheduleRepository";
import { IAddAvailbilityUseCase } from "../../../interface/beautician/schedule/IAddAvailabilityUseCase";
import { IAddAvailabilityRequest } from "../../../interfaceType/scheduleType";
import { AppError } from "../../../../domain/errors/appError";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { scheduleMessages } from "../../../../shared/constant/message/scheduleMessage";

export class AddAvailabilityUseCase implements IAddAvailbilityUseCase {
  constructor(private _scheduleRepo: IScheduleRepository) {}

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
            scheduleMessages.ERROR.LEAVE_CONFLICT(dateStr),
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
          scheduleMessages.ERROR.SLOT_OVERLAP(
            current.startTime,
            current.endTime,
            next.startTime,
            next.endTime,
          ),
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
