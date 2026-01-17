import { IGetBeauticianServicesListResponse } from "../../../../interfaceType/serviceType";

export interface IGetBeauticianServicesListUseCase{
execute(beauticianId:string,filter:'all'|'home'):Promise<IGetBeauticianServicesListResponse>
}