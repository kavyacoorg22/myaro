import { IRevenueOutPut } from "../../../../interfaceType/adminType";

export interface IGetRevenueUSeCase {
  execute():Promise<IRevenueOutPut>
}