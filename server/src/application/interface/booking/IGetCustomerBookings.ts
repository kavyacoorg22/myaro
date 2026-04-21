import { IGetBeauticianBookingsInput, IGetBeauticianBookingsResult, IGetCustomerBookingsInput, IGetCustomerBookingsResult } from "../../interfaceType/booking";

export interface IGetCustomerBookingsUseCase{
  execute(input:IGetCustomerBookingsInput):Promise<IGetCustomerBookingsResult>
}