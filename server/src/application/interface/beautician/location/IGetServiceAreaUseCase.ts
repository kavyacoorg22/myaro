import { IGetServiceAreaResponse } from "../../../interfaceType/beauticianType";


export interface IGetServiceAreaUseCase {
  execute(beauticianId:string):Promise<IGetServiceAreaResponse>
}