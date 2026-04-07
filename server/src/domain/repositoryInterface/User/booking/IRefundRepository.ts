import { Refund } from "../../../entities/refund";


export interface IRefundRepository{
  create(data:Omit<Refund,'id'|'createdAt'|'updatedAt'>):Promise<Refund>
  findByPaymentId(paymentId:string):Promise<Refund|null>
  updateStatus(id:string,status:string,extra?:Partial<Refund>):Promise<Refund|null>

}