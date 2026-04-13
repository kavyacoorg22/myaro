import type { RefundMethodType, RefundTypes } from "../../constants/types/payment";

export interface IGetUserRefundSummeryDto{
   id:string,
   amount:number,
   method:RefundMethodType,
   refundType:RefundTypes,
   processedAt:string,
}