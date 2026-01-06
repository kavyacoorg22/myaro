import {  IResetPasswordInput, IResponse } from "../../interfaceType/authtypes";

export interface IResetPasswordUseCase{
  execute(data:IResetPasswordInput):Promise<IResponse>
} 