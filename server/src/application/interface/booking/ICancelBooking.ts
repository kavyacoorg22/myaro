import { ICancelBookingInput, ICancelBookingOutput } from "../../interfaceType/booking";

export interface ICancelBookingUseCase{
  execute(input:ICancelBookingInput):Promise<ICancelBookingOutput>
}