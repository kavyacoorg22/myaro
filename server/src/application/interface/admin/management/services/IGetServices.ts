import { Service } from "../../../../../domain/entities/service";
import { IGetServiceResponse } from "../../../../interfaceType/serviceType";

export interface IGetServicesUseCase{
  execute(categoryId:string):Promise<IGetServiceResponse>
}