import { Category } from "../entities/category";

export interface ICategoryRepository{
  create(data:Omit<Category,'id'|'createdAt'|'updatedAt'>):Promise<Category>
  findByName(name:string):Promise<Category|null>
  updateCategoryById(id:string,data:Partial<Omit<Category,'id'|'updatedAt'|'createdAt'>>):Promise<boolean>
  findById(id:string):Promise<Category|null>
  findAllActive():Promise<Category[]>
}