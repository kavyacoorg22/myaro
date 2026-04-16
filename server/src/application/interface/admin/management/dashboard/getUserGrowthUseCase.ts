import {  IUserGrowthOutPut } from "../../../../interfaceType/adminType";

export interface IGetUserGrowthUSeCase {
  execute(year?:number):Promise<IUserGrowthOutPut>
}