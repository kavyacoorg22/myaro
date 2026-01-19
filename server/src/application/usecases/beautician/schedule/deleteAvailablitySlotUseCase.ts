import { Slot } from "../../../../domain/entities/schedule";
import { AppError } from "../../../../domain/errors/appError";
import { IScheduleRepository } from "../../../../domain/repositoryInterface/IScheduleRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IDeleteAvailbilitySlotUseCase } from "../../../interface/beautician/schedule/IDeleteAvailabilitySlotUSeCase";

export class DeleteAvailibilitySlotUseCase implements IDeleteAvailbilitySlotUseCase {
  private _scheduleRepo: IScheduleRepository;
  constructor(scheduleRepo: IScheduleRepository) {
    this._scheduleRepo = scheduleRepo;
  }
  async execute(
    beauticianId: string,
    scheduleId: string,
    slotToDelete: Slot,
  ): Promise<void> {
    const schedule = await this._scheduleRepo.findByBeauticianId(beauticianId);
    if (!schedule) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (beauticianId !== schedule.beauticianId) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    const initialLength = schedule.slots.length;

    const updatedSlots = schedule.slots.filter(
      (slot) =>
        !(
          slot.startTime === slotToDelete.startTime &&
          slot.endTime === slotToDelete.endTime
        ),
    );

    if (updatedSlots.length === initialLength) {
      throw new AppError("Slot not found", HttpStatus.NOT_FOUND);
    }

    await this._scheduleRepo.updateById(scheduleId, {
      slots: updatedSlots,
    });
  }
}
