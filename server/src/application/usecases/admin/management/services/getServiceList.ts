import { IBeauticianServiceRepository } from "../../../../../domain/repositoryInterface/IBeauticianServiceRepository";
import { IGetBeauticianServicesListUseCase } from "../../../../interface/beauticianService/IGetBeauticianService";
import {
  IGetBeauticianServicesListResponse,
  PriceFilter,
} from "../../../../interfaceType/serviceType";
import { toGetBeauticianServiceList } from "../../../../mapper/serviceMapper";

export class GetBeauticianServicesListUseCase implements IGetBeauticianServicesListUseCase {
  constructor(private _beauticianServiceRepo: IBeauticianServiceRepository) {}
  async execute(
    beauticianId: string,
    filter: "all" | "home",
    priceFilter?: PriceFilter,
  ): Promise<IGetBeauticianServicesListResponse> {
    const services = await this._beauticianServiceRepo.findByBeauticianId(
      beauticianId,
      {
        homeServiceOnly: filter === "home",
        priceFilter: priceFilter || "all",
      },
    );

    const mapped = services.map((service) =>
      toGetBeauticianServiceList(service),
    );
    return { services: mapped };
  }
}
