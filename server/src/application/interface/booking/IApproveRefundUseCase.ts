import { Booking } from "../../../domain/entities/booking";
import { IApproveRefundUInput } from "../../interfaceType/booking";

export interface IApproveRefundUseCase{
  execute(input:IApproveRefundUInput):Promise<Booking>
}