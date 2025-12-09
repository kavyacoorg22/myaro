import {  IResetPasswordInput, IResponse } from "../../interfaceType/authtypes";

export interface IResetPassword{
  execute(data:IResetPasswordInput):Promise<IResponse>
} 