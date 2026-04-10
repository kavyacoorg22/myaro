import { IGetDisputeDetailOutput } from "../../../../interfaceType/adminType";

export interface IGetDisputeDetailsUseCase{
  execute(bookingId:string):Promise<IGetDisputeDetailOutput>
}