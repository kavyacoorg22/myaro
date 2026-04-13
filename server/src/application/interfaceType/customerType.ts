import { IGetUserRefundSummeryDto } from "../dtos/customer";

export interface ICustomerViewProfileOutput {
  fullName: string;
  userName: string;
  profileImg?:string
}

export interface ICustomerEditProfileInput{
  fullName?:string,
  userName?:string
}

export interface IGetUserRefundSummeryOutPut{
   refunds:IGetUserRefundSummeryDto[],
   totalBalance:number 
}
