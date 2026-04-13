import { Refund } from "../../../entities/refund";
import { RefundStatus } from "../../../enum/paymentEnum";


export interface IRefundRepository{
  create(data:Omit<Refund,'id'|'createdAt'|'updatedAt'>):Promise<Refund>
  findByPaymentId(paymentId:string):Promise<Refund|null>
  updateStatus(id:string,status:string,extra?:Partial<Refund>):Promise<Refund|null>
  updateById(id:string, data: Partial<Omit<Refund, "id">>):Promise<Refund|null>
   findAll(params: {
    page:    number;
    limit:   number;
    status?: RefundStatus;
  }): Promise<{ refunds: Refund[]; total: number }>;
  findById(id: string): Promise<Refund | null>;
  getRefundsByUserId(userId:string):Promise<Refund[]>
}