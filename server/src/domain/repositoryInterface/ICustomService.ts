import { CustomService } from "../entities/customService";


export interface ICustomServiceRepository{
  create(data:Omit<CustomService,'id'|'createdAt'|'updatedAt'>):Promise<CustomService>
}