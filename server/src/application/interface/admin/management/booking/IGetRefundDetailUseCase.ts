import { IGetRefundDetailOutput } from "../../../../interfaceType/adminType";

export interface IGetRefundDetailUseCase{
  execute(bookingId:string):Promise<IGetRefundDetailOutput>
}