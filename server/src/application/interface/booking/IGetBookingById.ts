import { IGetBookingByIdResponse } from "../../interfaceType/booking";


export interface IGetBookingByIdUseCase{
  execute(bookingId:string,requesterId:string):Promise<IGetBookingByIdResponse>
}