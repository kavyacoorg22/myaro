import { CategoryVO, ServiceVO } from "../../domain/entities/customService"
import { ICategoryServiceSelectionDto, ICustomCategoryServiceSelectionDto, ICustomServiceSelectionDto, IGetBeauticianServicesListDto, IGetServiceDto } from "../dtos/services"

export interface ICategoryRequest{
  name:string,
  description:string
}

export interface IServiceRequest{
  name:string,
  isActive:boolean
}

export interface IToggleServiceStatusRequest{
  isActive:boolean
}

export interface IAddServiceRequest{
  name:string,
  categoryId:string
}

export interface IGetServiceResponse{
  services:IGetServiceDto[]
}

export interface IUpsertBeauticianServiceRequest{
  beauticianId:string,
  serviceId:string,
  categoryId:string,
  price:number,
  isHomeServiceAvailable:boolean,
}

export interface IAddCustomServiceRequest{
 beauticianId:string,
  category:CategoryVO,
  service:ServiceVO,
}

export interface IBeauticianServiceSelectionResponse {
  categories: ICategoryServiceSelectionDto[];
  customServices:  ICustomCategoryServiceSelectionDto[];
}



export interface IGetBeauticianServicesListResponse{
  services:IGetBeauticianServicesListDto[]
}

export interface IGetPamphletResponse{
  pamphletUrl:string
}