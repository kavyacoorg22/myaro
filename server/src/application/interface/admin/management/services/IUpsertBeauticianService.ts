import { IUpsertBeauticianServiceRequest } from "../../../../interfaceType/serviceType";

export interface IUpsertBeauticianServiceUseCase{
  execute(input:IUpsertBeauticianServiceRequest):Promise<void>
}