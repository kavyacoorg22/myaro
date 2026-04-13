import { IGetUserRefundSummeryOutPut } from "../../interfaceType/customerType";

export interface IGetUserRefundSummeryUseCase{
  execute(userId:string):Promise<IGetUserRefundSummeryOutPut>
}