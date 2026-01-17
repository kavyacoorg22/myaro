import { Category } from "../../../domain/entities/category";
import { ICategoryRepository } from "../../../domain/repositoryInterface/ICategoryRepository";
import { IToggleActiveStatusRepository } from "../../../domain/repositoryInterface/IToggleActiveRepository";
import { CategoryDoc, categoryModel } from "../../database/models/service/categoryModel";
import { GenericRepository } from "../genericRepository";


function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export class CategoryRepository extends GenericRepository<Category,CategoryDoc> implements ICategoryRepository,IToggleActiveStatusRepository{
  constructor(){
    super(categoryModel)
  }

  async create(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    const created=await categoryModel.create(data)
    return this.map(created)
  }

  async findByName(name: string): Promise<Category | null> {
    const escapedName=escapeRegex(name)
    const doc=await categoryModel.findOne({name:{$regex:`^${escapedName}$`,$options:"i"},isActive:true})
    return doc?this.map(doc):null
  }

  async updateCategoryById(id: string,data:Partial<Omit<Category,'id'|'updatedAt'|'createdAt'>>): Promise<boolean> {
    const doc=await categoryModel.findByIdAndUpdate(
      id,
      {$set:data},
      {new:true}
    ).exec()

    return doc!==null
  }

  async toggleActive(id: string, isActive: boolean): Promise<boolean> {
    const doc=await categoryModel.findByIdAndUpdate(
      id,
      {isActive},
      {new:true}
    )
    return doc!==null
  }

  async findById(id: string): Promise<Category | null> {
    const doc=await categoryModel.findById({id,isActive:true})
    return doc?this.map(doc):null
  }

  async findAllActive(): Promise<Category[]> {
    const docs=await categoryModel.find({isActive:true})
    return docs.map((doc)=>this.map(doc as CategoryDoc))
  }


  protected map(doc:CategoryDoc):Category{
   const base=super.map(doc) as any
   return {
    id:base.id,
    name:doc.name,
    type:doc.type,
    createdBy:doc.createdBy.toString(),
    isActive:doc.isActive,
    description:doc.description,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
  
   }
  }
}