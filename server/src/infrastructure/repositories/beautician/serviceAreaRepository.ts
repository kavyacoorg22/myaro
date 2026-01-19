import { Types } from "mongoose";
import {
  LocationVO,
  ServiceArea,
} from "../../../domain/entities/beauticianServiceAres";
import { IServiceAreaRepository } from "../../../domain/repositoryInterface/IBeauticianServiceAreaRepository";
import {
  ServiceAreaDoc,
  ServiceAreaModel,
} from "../../database/models/service/serviceAreaModel";
import { GenericRepository } from "../genericRepository";

export class ServiceAreaRepository
  extends GenericRepository<ServiceArea, ServiceAreaDoc>
  implements IServiceAreaRepository
{
  constructor() {
    super(ServiceAreaModel);
  }
  async findByBeauticianId(beauticianId: string): Promise<ServiceArea | null> {
    const doc = await ServiceAreaModel.findById({
      beauticianId: new Types.ObjectId(beauticianId),
    });
    return doc ? this.map(doc) : null;
  }

  async create(
    data: Omit<ServiceArea, "id" | "createdAt" | "updatedAt">,
  ): Promise<ServiceArea> {
    const doc = await ServiceAreaModel.create(data);
    return this.map(doc);
  }

  async updateLocations(
    beauticianId: string,
    data: {
      homeServiceLocation?: LocationVO[];
      serviceLocation?: LocationVO[];
    },
  ): Promise<void> {
    await ServiceAreaModel.updateOne(
      { beauticianId: new Types.ObjectId(beauticianId) },
      {
        $set: {
          ...(data.homeServiceLocation && {
            homeServiceLocation: data.homeServiceLocation,
          }),
          ...(data.serviceLocation && {
            serviceLocation: data.serviceLocation,
          }),
        },
      },
    );
  }

  protected map(doc: ServiceAreaDoc): ServiceArea {
    const base = super.map(doc) as any;
    return {
      id: base.id,
      beauticianId: doc.beauticianId.toString(),
      homeServiceLocation: doc.homeServiceLocation.map((loc) => ({
        placeId: loc.placeId,
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng,
        formattedString: loc.formattedString,
      })),
      serviceLocation: doc.serviceLocation.map((loc) => ({
        placeId: loc.placeId,
        city: loc.city,
        lat: loc.lat,
        lng: loc.lng,
        formattedString: loc.formattedString,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
