import { Service } from "../../../domain/entities/service";
import { IServiceRepository } from "../../../domain/repositoryInterface/IServiceRepository";
import { IToggleActiveStatusRepository } from "../../../domain/repositoryInterface/IToggleActiveRepository";
import { ServiceDoc, ServiceModel } from "../../database/models/service/serviceModel";
import { GenericRepository } from "../genericRepository";


function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class ServiceRepository extends GenericRepository<Service,ServiceDoc> implements IServiceRepository,IToggleActiveStatusRepository{
constructor()
{
  super(ServiceModel)
}

async create(data: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
  const doc=await ServiceModel.create(data)
  return this.map(doc)
}


async findByName(name: string): Promise<boolean> {
  const escapedName = escapeRegex(name)
  const doc=await ServiceModel.findOne({name: { $regex: `^${escapedName}$`, $options: "i" },isActive:true})
  return doc!==null
}

async updateServiceById(id: string, name:string): Promise<boolean> {
  const doc=await ServiceModel.findByIdAndUpdate(id,{$set:{name}},{new:true})
  return doc!==null;
}

async findByCategoryId(id: string): Promise<Service[]> {
  const docs=await ServiceModel.find({categoryId:id,isActive:true})
  return docs.map((doc)=>this.map(doc as ServiceDoc))
}

async toggleActive(id: string, isActive: boolean): Promise<boolean> {
  const doc=await ServiceModel.findByIdAndUpdate(id,{isActive},{new:true})
  return !!doc
}

async findById(id: string): Promise<Service | null> {
  const doc=await ServiceModel.findById(id)
  return doc?this.map(doc):null
}

  async findAllActive(): Promise<Service[]> {
    const docs=await ServiceModel.find({isActive:true})
    return docs.map((doc)=>this.map(doc as ServiceDoc))
  }

  
protected map(doc:ServiceDoc):Service{
 const base=super.map(doc) as any
 return{
  id:base.id,
  name:doc.name,
  categoryId:doc.categoryId.toString(),
  suggestedPrice:doc.suggestedPrice,
  isActive:doc.isActive,
  createdAt:doc.createdAt,
  updatedAt:doc.updatedAt
 }
}

}