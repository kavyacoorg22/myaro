import { IProcessRefundInput, IProcessRefundOutPut } from "../../../../interfaceType/adminType";

export interface IProcessRefundUseCase{
  execute(input:IProcessRefundInput):Promise<IProcessRefundOutPut>
}