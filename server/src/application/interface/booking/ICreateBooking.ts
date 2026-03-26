import { Booking } from "../../../domain/entities/booking";
import { ICreateBookingInput } from "../../interfaceType/booking";

export interface ICreateBookingUseCase{
  execute(input:ICreateBookingInput):Promise<Booking>
}