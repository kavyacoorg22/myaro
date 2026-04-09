import { PayoutStatus } from "../enum/paymentEnum";

export interface Payout{
  id:string,
  paymentId:string,
  customerId:string,
  beauticianId:string,
  amount:number,
  status:PayoutStatus,
  adminNote?:string,
  createdAt:Date,
  updatedAt:Date
}