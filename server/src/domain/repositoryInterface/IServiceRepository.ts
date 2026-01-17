import { Service } from "../entities/service";


export interface IServiceRepository{
  create(input:Partial<Omit<Service,"id"|"createdAt"|'updatedAt'>>):Promise<Service|null>
  findByName(name:string):Promise<boolean>
  updateServiceById(id:string,name:string):Promise<boolean>
  findByCategoryId(id:string):Promise<Service[]>
  findById(id:string):Promise<Service|null>
  findAllActive():Promise<Service[]>
}