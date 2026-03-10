import { IDeleteRecursionScheduleInput } from "../../../interfaceType/scheduleType";

export interface IDeleteRecurringAvailabilitySlotUseCase{
  execute(beauticianId:string,input:IDeleteRecursionScheduleInput):Promise<void>
}