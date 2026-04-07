import { Booking } from "../../../domain/entities/booking";
import { IRequestRefundInput } from "../../interfaceType/booking";

export interface IRequestRefundUseCase{
  execute(input:IRequestRefundInput):Promise<Booking>
}