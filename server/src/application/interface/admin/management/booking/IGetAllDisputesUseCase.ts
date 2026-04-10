import { IGetAllDisputeInput, IGetAllDisputeOutPut } from "../../../../interfaceType/adminType";

export interface IGetAllDisputesUseCase{
  execute(input:IGetAllDisputeInput):Promise<IGetAllDisputeOutPut>
}