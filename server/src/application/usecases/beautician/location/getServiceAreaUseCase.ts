import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IGetServiceAreaUseCase } from "../../../interface/beautician/location/IGetServiceAreaUseCase";
import { IGetServiceAreaResponse } from "../../../interfaceType/beauticianType";
import { toGetServiceAreaDto } from "../../../mapper/beauticianMapper";

export class getServiceAreaUseCase implements IGetServiceAreaUseCase{
  constructor(
    private readonly beauticianRepo: IBeauticianRepository
  ) {}
 
  async execute(beauticianId: string): Promise<IGetServiceAreaResponse> {
    const data=await this.beauticianRepo.findByUserId(beauticianId)
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