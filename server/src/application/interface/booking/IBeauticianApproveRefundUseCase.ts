import { Booking } from "../../../domain/entities/booking";
import { IBeauticianApproveRefundUInput } from "../../interfaceType/booking";

export interface IBeauticianApproveRefundUseCase{
  execute(input:IBeauticianApproveRefundUInput):Promise<Booking>
}