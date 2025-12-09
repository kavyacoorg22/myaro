import { IResponse } from "../../interfaceType/authtypes";



export interface IClearSeachHistoryUseCase {
  execute(userId:string):Promise<IResponse>
}