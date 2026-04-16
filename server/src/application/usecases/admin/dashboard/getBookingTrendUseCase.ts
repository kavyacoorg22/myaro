import { IBookingRepository } from "../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IGetBookingTrendUSeCase } from "../../../interface/admin/management/dashboard/getBookingTrendUseCase";
import { IBookingTrendOutPut } from "../../../interfaceType/adminType";
import { toBookingTrendDto } from "../../../mapper/adminMapper";

export class GetBookingTrendUC implements IGetBookingTrendUSeCase {
  constructor(private readonly bookingRepo: IBookingRepository) {}
 
  async execute(year?: number): Promise<IBookingTrendOutPut> {
    const result = await this.bookingRepo.getBookingTrendByMonth(year);
    const data=  result.map((t)=>toBookingTrendDto(t));
    return{data}
  }
}