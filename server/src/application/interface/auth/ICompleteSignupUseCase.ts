import { ICompleteSignupInput, IResponse } from "../../interfaceType/authtypes";


export interface ICompleteSignupUseCase{
  execute(input:ICompleteSignupInput):Promise<IResponse>
}