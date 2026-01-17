import { IBeauticianServiceRepository } from "../../../../../domain/repositoryInterface/IBeauticianServiceRepository";
import { IGetBeauticianServicesListUseCase } from "../../../../interface/admin/management/services/IGetBeauticianService";
import { IGetBeauticianServicesListResponse } from "../../../../interfaceType/serviceType";
import { toGetBeauticianServiceList } from "../../../../mapper/serviceMapper";


export class GetBeauticianServicesListUseCase implements IGetBeauticianServicesListUseCase{
  private _beauticianServiceRepo:IBeauticianServiceRepository
  constructor(beauticianServiceRepo:IBeauticianServiceRepository)
  {
    this._beauticianServiceRepo=beauticianServiceRepo
  }
  async execute(beauticianId: string,filter:'all'|'home'): Promise<IGetBeauticianServicesListResponse> {
    const services=await this._beauticianServiceRepo.findByBeauticianId(beauticianId,{
       homeServiceOnly:filter==='home'
    })

    const mapped=services.map((service)=>toGetBeauticianServiceList(service))

    return {services:mapped}
  }
}