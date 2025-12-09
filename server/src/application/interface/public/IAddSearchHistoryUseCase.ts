import { IResponse } from "../../interfaceType/authtypes";



export interface IAddSearchHistoryUseCase{
  execute(userId:string,beauticianId:string):Promise<IResponse>
}