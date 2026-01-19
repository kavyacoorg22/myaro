import { ServiceArea, LocationVO } from "../entities/beauticianServiceAres";

export interface IServiceAreaRepository {
  findByBeauticianId(beauticianId: string): Promise<ServiceArea | null>;

  create(
    data: Partial<Omit<ServiceArea, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ServiceArea>;

  updateLocations(
    beauticianId: string,
    data: {
      homeServiceLocation?: LocationVO[];
      serviceLocation?: LocationVO[];
    },
  ): Promise<void>;
}
