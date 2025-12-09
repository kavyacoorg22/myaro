import { IBeauticianStatusOutPut } from "../../interfaceType/beauticianType";



export interface IBeauticianVerificationUseCase{
  execute(userId:string):Promise<IBeauticianStatusOutPut>
}