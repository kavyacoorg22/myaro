import { IResponse, ISendOtpInput } from "../../interfaceType/authtypes";


export interface ICreateOtpUseCase{
  execute(input:ISendOtpInput):Promise<IResponse>
}