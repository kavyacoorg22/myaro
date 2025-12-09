
import { IForgotPasswordInput, IResponse } from "../../interfaceType/authtypes";

export interface IForgotUseCase{
  execute(data:IForgotPasswordInput):Promise<IResponse>
} 