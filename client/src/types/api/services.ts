import type { CategoryVO, ICategoryServiceSelectionDto, ICustomCategoryServiceSelectionDto, IGetBeauticianServicesListDto, IGetCategoryDto, IGetCustomServiceDto, IGetServiceDto, ServiceVO } from "../dtos/service"
import type { BackendResponse } from "./api"



export interface IAddCategoryRequest{
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
   categoryId:string
  name:string,
 
}

export interface IGetServiceResponseData{
  services:IGetServiceDto[]
}
export interface IGetCategory{
    categoryId:string,
  name:string,
  isActive:boolean,
  description:string,
}

export interface IGetCategoryResponseData{
  category:IGetCategory[]
}
export interface IUpsertBeauticianServiceRequest{
  serviceId:string,
  categoryId:string,
  price:number,
  isHomeServiceAvailable:boolean,
}

export interface IAddCustomServiceRequest{
  category:CategoryVO,
  service:ServiceVO,
}

export interface IBeauticianServiceSelectionResponseData {
  categories: ICategoryServiceSelectionDto[];
  customServices:  ICustomCategoryServiceSelectionDto[];
}



export interface IGetBeauticianServicesListResponseData{
  services:IGetBeauticianServicesListDto[]
}

export interface IGetPamphletResponseData{
  pamphletUrl:string
}

export interface IGetAllCustomServiceResponseData{
  customService:IGetCustomServiceDto[],
    pagination: {
        total:number
        page:number
        limit:number
        totalPages: number
      },
}

export interface IGetCustomServiceDetailResponseData{
  customService:IGetCustomServiceDto
}

export type PriceFilter = 
  | "all" 
  | "low-high" 
  | "high-low" 
  | "under-500" 
  | "500-1000" 
  | "1000-2000" 
  | "above-2000";

export type IGetCategoryResponse=BackendResponse<IGetCategoryResponseData>
export type IGetServiceResponse=BackendResponse<IGetServiceResponseData>
export type IGetBeauticianServicesListResponse=BackendResponse<IGetBeauticianServicesListResponseData>
export type IBeauticianServiceSelectionResponse=BackendResponse<IBeauticianServiceSelectionResponseData>
export type IGetAllCustomServiceResponse=BackendResponse<IGetAllCustomServiceResponseData>
export type IGetPamphletResponse=BackendResponse<IGetPamphletResponseData>