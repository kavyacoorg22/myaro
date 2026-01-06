import { IRegisterInput, IResponse } from "../../interfaceType/authtypes";

export interface IRegisterUserUseCase{
  execute(input:IRegisterInput):Promise<IResponse>
}