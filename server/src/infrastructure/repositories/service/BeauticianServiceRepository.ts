import { BeauticianService } from "../../../domain/entities/beauticianService";
import { IBeauticianServiceRepository } from "../../../domain/repositoryInterface/IBeauticianServiceRepository";
import {
  BeauticianServiceDoc,
  BeauticianServiceModel,
} from "../../database/models/service/BeauticianServiceModel";
import { GenericRepository } from "../genericRepository";

export class BeauticianServiceRepository
  extends GenericRepository<BeauticianService, BeauticianServiceDoc>
  implements IBeauticianServiceRepository
{
  constructor() {
    super(BeauticianServiceModel);
  }

  async createOrUpdate(
    data: Omit<BeauticianService, "id" | "updatedAt" | "createdAt">
  ): Promise<BeauticianService> {
    const filter = data.serviceId
      ? {
          beauticianId: data.beauticianId,
          serviceId: data.serviceId,
        }
      : {
          beauticianId: data.beauticianId,
          submissionId: data.submissionId,
        };

    const doc = await BeauticianServiceModel.findOneAndUpdate(
      filter,
      { $set: data },
      { upsert: true, new: true }
    );

    return this.map(doc);
  }


  async findByBeauticianId(beauticianId: string,options?: { homeServiceOnly?: boolean }): Promise<BeauticianService[]> {
 
  const query: any = { beauticianId };

  if (options?.homeServiceOnly === true) {
    query.isHomeServiceAvailable = true;
  }

  const docs = await BeauticianServiceModel
    .find(query)
    .sort({ createdAt: -1 });

  return docs.map(doc => this.map(doc));
  }
  protected map(doc: BeauticianServiceDoc): BeauticianService {
    const base = super.map(doc) as any;
    return {
      id: base.id,
      beauticianId: doc.beauticianId.toString(),
      serviceId: doc.serviceId?.toString(),
      categoryId: doc.categoryId?.toString(),
      serviceName: doc.serviceName,
      categoryName: doc.categoryName,
      price: doc.price,
      isHomeServiceAvailable: doc.isHomeServiceAvailable,
      submissionId: doc.submissionId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
