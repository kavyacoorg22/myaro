import { IResponse } from "../../interfaceType/authtypes";
import { IBeauticianEditProfileInput } from "../../interfaceType/beauticianType";


export interface IBeauticianEditProfileUseCase{
  execute(userId:string,data:IBeauticianEditProfileInput):Promise<IResponse>
}