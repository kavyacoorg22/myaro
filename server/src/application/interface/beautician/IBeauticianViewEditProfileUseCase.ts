import { IBeauticianViewEditProfileOutput } from "../../interfaceType/beauticianType"


export interface IBeauticianViewEditProfileUseCase{
  execute(id:string):Promise<IBeauticianViewEditProfileOutput>
}