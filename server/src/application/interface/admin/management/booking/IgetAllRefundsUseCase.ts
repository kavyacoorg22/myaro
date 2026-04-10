import { IGetAllRefundInput, IGetAllRefundOutput } from "../../../../interfaceType/adminType";

export interface IGetAllRefundsUseCase{
  execute(input:IGetAllRefundInput):Promise<IGetAllRefundOutput>
}