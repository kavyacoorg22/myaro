import { RefundStatus } from "../../../domain/enum/paymentEnum";
import { IRefundRepository } from "../../../domain/repositoryInterface/User/booking/IRefundRepository";
import { IGetUserRefundSummeryUseCase } from "../../interface/customer/IGetUserRefundSummeryUseCase";
import { IGetUserRefundSummeryOutPut } from "../../interfaceType/customerType";
import { toGetRefundSummeryDto } from "../../mapper/customerMapper";

export class GetUserRefundSummeryUseCase implements IGetUserRefundSummeryUseCase{
  constructor(private refundRepo:IRefundRepository){}
  

  async execute(userId: string): Promise<IGetUserRefundSummeryOutPut> {
    const refunds = await this.refundRepo.getRefundsByUserId(userId);
    const totalBalance = refunds
      .filter(r => r.status === RefundStatus.SUCCESS)
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      refunds: refunds.map(toGetRefundSummeryDto),
      totalBalance,
    };
  }
}