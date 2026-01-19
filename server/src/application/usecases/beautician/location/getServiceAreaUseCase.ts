import { IServiceAreaRepository } from "../../../../domain/repositoryInterface/IBeauticianServiceAreaRepository";
import { IGetServiceAreaUseCase } from "../../../interface/beautician/location/IGetServiceAreaUseCase";
import { IGetServiceAreaResponse } from "../../../interfaceType/beauticianType";
import { toGetServiceAreaDto } from "../../../mapper/beauticianMapper";

export class getServiceAreaUseCase implements IGetServiceAreaUseCase{
  constructor(
    private readonly serviceAreaRepo: IServiceAreaRepository
  ) {}
 
  async execute(beauticianId: string): Promise<IGetServiceAreaResponse> {
    const data=await this.serviceAreaRepo.findByBeauticianId(beauticianId)
    if(!data)
    {
      return {
        locations:{
          serviceLocation:[],
          homeServiceLocation:[]
        }
      }
    }
    const mapped=toGetServiceAreaDto(data)
    return {
      locations:mapped
    }
  }
}