
import { IForgotPasswordInput, IResponse } from "../../interfaceType/authtypes";

export interface IForgotPasswordUseCase{
  execute(data:IForgotPasswordInput):Promise<IResponse>
} 