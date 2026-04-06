import { ILockSlotInput } from "../../interfaceType/booking";

export interface ILockSlotUSeCase{
  execute(input:ILockSlotInput):Promise<{ttl:number}>
}