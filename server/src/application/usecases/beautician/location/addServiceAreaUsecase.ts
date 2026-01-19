import { LocationVO } from "../../../../domain/entities/beauticianServiceAres";
import { IServiceAreaRepository } from "../../../../domain/repositoryInterface/IBeauticianServiceAreaRepository";
import { IAddServiceAreaUseCase } from "../../../interface/beautician/location/IaddServiceAreaUseCase";
import { IAddServiceAreaRequest } from "../../../interfaceType/beauticianType";

export class AddServiceAreaUseCase
  implements IAddServiceAreaUseCase
{
  constructor(
    private readonly serviceAreaRepo: IServiceAreaRepository
  ) {}

  async execute(
    beauticianId: string,
    input:IAddServiceAreaRequest
  ): Promise<void> {

    const existing =
      await this.serviceAreaRepo.findByBeauticianId(beauticianId);

    if (!existing) {
      await this.serviceAreaRepo.create({
        beauticianId,
        homeServiceLocation: input.homeServiceLocation ?? [],
        serviceLocation: input.serviceLocation ?? [],
      });
      return;
    }

   
    const updatedHome = input.homeServiceLocation
      ? this.removeDuplicatesByPlaceId(input.homeServiceLocation)
      : existing.homeServiceLocation;

    const updatedService = input.serviceLocation
      ? this.removeDuplicatesByPlaceId(input.serviceLocation)
      : existing.serviceLocation;

    await this.serviceAreaRepo.updateLocations(beauticianId, {
      homeServiceLocation: updatedHome,
      serviceLocation: updatedService,
    });
  }

  private removeDuplicatesByPlaceId(locations: LocationVO[]) {
    const map = new Map<string, LocationVO>();
    locations.forEach(loc => map.set(loc.placeId, loc));
    return Array.from(map.values());
  }
  
}
