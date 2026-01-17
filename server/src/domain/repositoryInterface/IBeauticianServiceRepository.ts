import { BeauticianService } from "../entities/beauticianService";


export interface IBeauticianServiceRepository{
  createOrUpdate(data:Omit<BeauticianService,'id'|'updatedAt'|'createdAt'>):Promise<BeauticianService>
  findByBeauticianId(beauticianId:string, options?: { homeServiceOnly?: boolean }):Promise<BeauticianService[]>
  
}