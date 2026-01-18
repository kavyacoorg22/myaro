import { CustomService } from "../../../domain/entities/customService";
import { ICustomServiceRepository } from "../../../domain/repositoryInterface/ICustomService";
import {
  CustomServiceDoc,
  CustomServiceModel,
} from "../../database/models/service/customServiceModel";
import { GenericRepository } from "../genericRepository";

export class CustomServiceRepository
  extends GenericRepository<CustomService, CustomServiceDoc>
  implements ICustomServiceRepository
{
  constructor() {
    super(CustomServiceModel);
  }

  async create(
    data: Omit<CustomService, "id" | "createdAt" | "updatedAt">,
  ): Promise<CustomService> {
    const doc = await CustomServiceModel.create(data);
    return this.map(doc);
  }

  async findById(id: string): Promise<CustomService | null> {
    const doc = await CustomServiceModel.findById(id);
    return doc ? this.map(doc) : null;
  }

  async fetchAllService(
    query: any,
    skip: number,
    limit: number,
  ): Promise<{ data: CustomService[]; total: number }> {
    const [docs, total] = await Promise.all([
      CustomServiceModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      CustomServiceModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc) => this.map(doc)),
      total,
    };
  }

  async updateById(
    id: string,
    data: Partial<Omit<CustomService, "id">>,
  ): Promise<CustomService | null> {
    const doc = await CustomServiceModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return doc ? this.map(doc) : null;
  }

  protected map(doc: CustomServiceDoc): CustomService {
    const base = super.map(doc) as any;
    return {
      id: base.id,
      type: doc.type,
      beauticianId: doc.beauticianId.toString(),
      category: {
        name: doc.category.name,
        categoryId: doc.category.categoryId,
      },
      service: {
        name: doc.service.name,
        price: doc.service.price,
        isHomeServiceAvailable: doc.service.isHomeServiceAvailable,
      },
      status: doc.status,
      reviewedBy: doc.reviewdBy?.toString(),
      reviewedAt: doc.reviewdAt,
      result: {
        serviceId: doc.result?.serviceId?.toString(),
        categoryId: doc.result?.categoryId?.toString(),
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
