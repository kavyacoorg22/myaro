import { PriceFilter } from "../../application/interfaceType/serviceType";
import { BeauticianService } from "../entities/beauticianService";


export interface IBeauticianServiceRepository{
  createOrUpdate(data:Omit<BeauticianService,'id'|'updatedAt'|'createdAt'>):Promise<BeauticianService>
  findByBeauticianId(beauticianId:string, options?: { homeServiceOnly?: boolean ,priceFilter:PriceFilter}):Promise<BeauticianService[]>
  findByServiceName(beauticianId:string,name:string):Promise<BeauticianService|null>
  
}