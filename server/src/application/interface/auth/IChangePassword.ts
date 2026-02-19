import { IChangePasswordInput } from "../../interfaceType/authtypes";


export interface IChangePasswordUseCase{
  execute(id:string,input:IChangePasswordInput):Promise<void>
}