import { IGetAvailabilitySlotResponse } from "../../../interfaceType/scheduleType";


export interface IGetAvailbilityUseCase{
  execute(beauticianId:string,date:Date):Promise<IGetAvailabilitySlotResponse>
}