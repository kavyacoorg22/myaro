import { IAddAvailabilityRequest } from "../../../interfaceType/scheduleType";

export interface IAddAvailbilityUseCase{
  execute(beauticianId:string,input:IAddAvailabilityRequest):Promise<void>
}