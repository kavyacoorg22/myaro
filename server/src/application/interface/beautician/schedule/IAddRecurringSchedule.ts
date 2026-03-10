import { IAddRecursionScheduleInput } from "../../../interfaceType/scheduleType";

export interface IAddRecursionScheduleUseCase{
  execute(beauticianId:string,input:IAddRecursionScheduleInput):Promise<void>
}