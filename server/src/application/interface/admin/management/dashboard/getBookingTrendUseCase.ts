import { IBookingTrendOutPut } from "../../../../interfaceType/adminType";

export interface IGetBookingTrendUSeCase {
  execute(year?:number):Promise<IBookingTrendOutPut>
}