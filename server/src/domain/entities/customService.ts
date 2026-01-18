import { CategoryServiceType, CustomServiceStatus } from "../enum/serviceEnum";

export interface CategoryVO{
  name?:string,
  categoryId?:string,
}

export interface ServiceVO{
  name:string,
  price:number,
  isHomeServiceAvailable:boolean
}

export interface  ResultVO{
  serviceId?:string,
  categoryId?:string,
}

export interface CustomService{
  id:string,
  type:CategoryServiceType,
  beauticianId:string,
  category:CategoryVO,
  service:ServiceVO,
  status:CustomServiceStatus,
  reviewedBy?:string,
  reviewedAt?:Date,
  result?:ResultVO,
  createdAt:string,
  updatedAt:string
}