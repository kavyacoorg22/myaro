import { Booking } from "../../../domain/entities/booking";
import { IUpdateBookingStatusInput } from "../../interfaceType/booking";

export interface IUpdateBookingStatusUseCase{
  execute(input:IUpdateBookingStatusInput):Promise<Booking|null>
}