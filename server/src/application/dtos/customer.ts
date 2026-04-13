import { RefundMethod, RefundType } from "../../domain/enum/paymentEnum";

export interface ICustomerViewProfileDTO {
  fullName: string;
  userName: string;
  profileImg?: string;
}

export interface IGetUserRefundSummeryDto{
   id:string,
   amount:number,
   method:RefundMethod,
   refundType:RefundType,
   processedAt:string,
}