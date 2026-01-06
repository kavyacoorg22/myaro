import { IResponse, IVerifyOtpInput } from "../../interfaceType/authtypes";


export interface IVerifyOtpUseCase{
  execute(input:IVerifyOtpInput):Promise<IResponse>
}