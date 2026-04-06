import { IBlockBookedSlotInput } from "../../../interfaceType/scheduleType";

export interface IBlockBookedSlotUSeCase{
  execute(input:IBlockBookedSlotInput):Promise<void>
  
}