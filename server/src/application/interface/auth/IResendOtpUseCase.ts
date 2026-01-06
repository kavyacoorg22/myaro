import { IResponse, ISendOtpInput } from "../../interfaceType/authtypes";


export interface IResendOtpUseCase{
  execute(input:ISendOtpInput):Promise<IResponse>
}