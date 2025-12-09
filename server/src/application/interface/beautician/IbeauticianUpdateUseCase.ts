import { Beautician } from "../../../domain/entities/Beautician";
import { IBeauticianPaymentDeatilInput, IBeauticianPaymentDeatilOutput } from "../../interfaceType/beauticianType";

export interface IBeauticianUpdateRegistrationUseCase{
  execute(id:string,input:IBeauticianPaymentDeatilInput):Promise<IBeauticianPaymentDeatilOutput>
}