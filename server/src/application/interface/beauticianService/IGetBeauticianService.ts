import { IGetBeauticianServicesListResponse, PriceFilter } from "../../interfaceType/serviceType";

export interface IGetBeauticianServicesListUseCase {
  execute(
    beauticianId: string,
    filter: "all" | "home",
    priceFilter?:PriceFilter
  ): Promise<IGetBeauticianServicesListResponse>;
}
