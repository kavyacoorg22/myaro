import { IReleasePayoutInput, IReleasePayoutOutPut } from "../../../../interfaceType/adminType";

export interface IReleasePayoutUSeCase{
  execute(input:IReleasePayoutInput):Promise<IReleasePayoutOutPut>
}