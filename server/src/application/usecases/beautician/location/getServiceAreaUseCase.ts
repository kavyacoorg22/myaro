import { IServiceAreaRepository } from "../../../../domain/repositoryInterface/IBeauticianServiceAreaRepository";
import { IGetServiceAreaUseCase } from "../../../interface/beautician/location/IGetServiceAreaUseCase";
import { IGetServiceAreaResponse } from "../../../interfaceType/beauticianType";
import { toGetServiceAreaDto } from "../../../mapper/beauticianMapper";

export class getServiceAreaUseCase implements IGetServiceAreaUseCase{
  constructor(
    private readonly _serviceAreaRepo: IServiceAreaRepository,
  ) {}
 
  async execute(beauticianId: string): Promise<IGetServiceAreaResponse> {
    
    const data = await this._serviceAreaRepo.findByBeauticianId(beauticianId);
    if(!data)
    {
      return {
        locations:{
          serviceableLocation:[],
          homeServiceableLocation:[]
        }
      }
    }
    const mapped=toGetServiceAreaDto(data)
    return {
      locations:mapped
    }
  }
}