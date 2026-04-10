import { IGetBookingDetailOutPut } from "../../../../interfaceType/adminType";

export interface IGetBookingDetailUseCase{
  execute(bookingId:string):Promise<IGetBookingDetailOutPut>
}