import { IAddServiceAreaRequest } from "../../../interfaceType/beauticianType";


export interface IAddServiceAreaUseCase {
  execute(beauticianId:string,input:IAddServiceAreaRequest):Promise<void>
}