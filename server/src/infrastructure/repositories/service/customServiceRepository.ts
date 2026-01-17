import { CustomService } from "../../../domain/entities/customService";
import { ICustomServiceRepository } from "../../../domain/repositoryInterface/ICustomService";
import { CustomServiceDoc, CustomServiceModel } from "../../database/models/service/customServiceModel";
import { GenericRepository } from "../genericRepository";

export class CustomServiceRepository extends GenericRepository<CustomService,CustomServiceDoc> implements ICustomServiceRepository{
  constructor()
  {
    super(CustomServiceModel)
  }

  async create(data: Omit<CustomService, "id" | "createdAt" | "updatedAt">): Promise<CustomService> {
    const doc=await CustomServiceModel.create(data)
    return this.map(doc)
  }

  protected map(doc:CustomServiceDoc):CustomService{
    const base=this.map(doc) as any
    return{
      id:base.id,
      type:doc.type,
      beauticianId:doc.beauticianId.toString(),
      category:{
        name:doc.category.name,
        categoryId:doc.category.categoryId
      },
      service:{
        name:doc.service.name,
        price:doc.service.price,
        isHomeServiceAvailable:doc.service.isHomeServiceAvailable
      },
      status:doc.status,
      reviewdBy:doc.reviewdBy?.toString(),
      reviewdAt:doc.reviewdAt,
      result:{
        serviceId:doc.result?.serviceId?.toString(),
        categoryId:doc.result?.categoryId?.toString()
      },
     createdAt:doc.createdAt,
    updatedAt:doc.updatedAt

    }
  }
}