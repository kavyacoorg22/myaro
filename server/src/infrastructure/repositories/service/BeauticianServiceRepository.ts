import { FilterQuery, Types } from "mongoose";
import { BeauticianService } from "../../../domain/entities/beauticianService";
import { IBeauticianServiceRepository } from "../../../domain/repositoryInterface/IBeauticianServiceRepository";
import {
  BeauticianServiceDoc,
  BeauticianServiceModel,
} from "../../database/models/service/BeauticianServiceModel";
import { GenericRepository } from "../genericRepository";
import { PriceFilter } from "../../../application/interfaceType/serviceType";

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
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
          beauticianId: new Types.ObjectId(data.beauticianId),
          serviceId: data.serviceId,
        }
      : {
          beauticianId: new Types.ObjectId(data.beauticianId),
          submissionId: new Types.ObjectId(data.submissionId),
        };

    const doc = await BeauticianServiceModel.findOneAndUpdate(
      filter,
      { $set: data },
      { upsert: true, new: true }
    );

    return this.map(doc);
  }


  async findByBeauticianId(beauticianId: string,options?: { homeServiceOnly?: boolean,priceFilter:PriceFilter}): Promise<BeauticianService[]> {
    console.log(options)
  const query:FilterQuery<BeauticianServiceDoc> = {
  beauticianId: new Types.ObjectId(beauticianId),
   };


  if (options?.homeServiceOnly === true) {
    query.isHomeServiceAvailable = true;
  }

  if(options?.priceFilter && options.priceFilter!=='all')
  {
    switch(options.priceFilter)
    {
      case 'under-500':
        query.price={$lt:500}
        break;
      case '500-1000':
        query.price={$gte:500,$lte:1000}
        break;
      case '1000-2000':
        query.price={$gte:1000,$lte:2000}
        break;
      case 'above-2000':
        query.price={$gt:2000}
       break
    }
  }

  let queryBuilder= BeauticianServiceModel.find(query)
  if(options?.priceFilter==='low-high')
  {
    queryBuilder=queryBuilder.sort({price:1})
  }else if(options?.priceFilter==='high-low')
  {
    queryBuilder=queryBuilder.sort({price:-1})
  }else{
    queryBuilder = queryBuilder.sort({ createdAt: -1 })
  }

  const docs =await queryBuilder

  return docs.map(doc => this.map(doc));
  }

  async findByServiceName(beauticianId: string, name: string): Promise<BeauticianService | null> {
    const escapedName=escapeRegex(name)
    const data=await BeauticianServiceModel.findOne({
      beauticianId:new Types.ObjectId(beauticianId),
      serviceName:{$regex:`^${escapedName}$`,$options:'i'}
    })
    return data?this.map(data):null
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
