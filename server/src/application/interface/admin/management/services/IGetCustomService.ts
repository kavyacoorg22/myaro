import { CustomServiceFilter } from "../../../../../domain/enum/serviceEnum";
import { IGetAllCustomServiceResponse } from "../../../../interfaceType/serviceType";

export interface IGetAllCustomServiceUseCase{
  execute(page:number,limit:number,filter:CustomServiceFilter):Promise<IGetAllCustomServiceResponse>
}