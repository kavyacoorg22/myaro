import { IAddRecursionScheduleInput } from "../../../interfaceType/scheduleType";

export interface IAddRecurringLeaveScheduleUseCase{
  execute(beauticianId:string,input:IAddRecursionScheduleInput):Promise<void>
}