import { Slot } from "../../../../domain/entities/schedule";

export interface IDeleteAvailbilitySlotUseCase{
  execute(beauticianId:string,scheduleId:string, slotToDelete: Slot):Promise<void>
}