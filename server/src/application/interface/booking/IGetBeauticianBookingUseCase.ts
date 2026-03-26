import { IGetBeauticianBookingsInput, IGetBeauticianBookingsResult } from "../../interfaceType/booking";

export interface IGetBeauticianBookingsUseCase{
  execute(input:IGetBeauticianBookingsInput):Promise<IGetBeauticianBookingsResult>
}