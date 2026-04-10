import { IGetAllBookingOutPut, IGetAllBookingsInput } from "../../../../interfaceType/adminType";

export interface IGetAllBookingsUseCase{
  execute(input:IGetAllBookingsInput):Promise<IGetAllBookingOutPut>
}