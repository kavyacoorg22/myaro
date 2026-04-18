import { IPaymentRepository } from "../../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { IGetRevenueUSeCase } from "../../../interface/admin/management/dashboard/getRevenueStatus";
import { IRevenueOutPut } from "../../../interfaceType/adminType";
import { toRevenueDto } from "../../../mapper/adminMapper";

export class GetRevenueUC implements IGetRevenueUSeCase{
  constructor(private readonly _paymentRepo: IPaymentRepository) {}
 
  async execute(): Promise<IRevenueOutPut> {
    const result = await this._paymentRepo.getRevenueStats();
    const data= toRevenueDto(result ?? { completed: 0, refunded: 0, held: 0 });
    return {data}
  }
}