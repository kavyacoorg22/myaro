import type { IGetUserRefundSummeryDto } from "../dtos/customer";
import type { BackendResponse } from "./api";

export interface IGetUserRefundSummeryOutPutData{
   refunds:IGetUserRefundSummeryDto[],
   totalBalance:number 
}

export type IGetUserRefundSummeryOutPut=BackendResponse<IGetUserRefundSummeryOutPutData>
