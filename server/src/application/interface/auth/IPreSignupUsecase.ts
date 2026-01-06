import { IPreSignupInput, IPreSignupOutput } from "../../interfaceType/authtypes";


export interface IPresignupUseCase{
  execute(input:IPreSignupInput):Promise<IPreSignupOutput>
}