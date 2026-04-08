import { Booking } from "../../../domain/entities/booking";
import { IDisputeRefundUInput } from "../../interfaceType/booking";

export interface IDisputeRefundUseCase{
   execute(input: IDisputeRefundUInput): Promise<Booking>;
}