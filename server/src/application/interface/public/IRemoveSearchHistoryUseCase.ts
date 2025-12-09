import { IResponse } from "../../interfaceType/authtypes";


export interface IRemoveSearchHistoryUseCase{
  execute(searchHistoryId:string):Promise<IResponse>
}