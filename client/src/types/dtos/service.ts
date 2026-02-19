import type { CategoryServiceTypes, CustomServiceStatusType } from "../../constants/types/service";

export interface CategoryVO{
  name?:string,
  categoryId?:string,
}

export interface ServiceVO{
  name:string,
  price:number,
  isHomeServiceAvailable:boolean
}
export interface IGetServiceDto
{
  id:string,
  name:string,
  categoryId:string,
  isActive:boolean,
}

export interface IServiceSelectionDto {
  serviceId?: string;              
  serviceName: string;
  selected?: boolean;              
  categoryName?: string;           
  price: number;
  isHomeServiceAvailable: boolean;
  isCustom?: boolean;              
  submissionId?: string;           
}

export interface ICategoryServiceSelectionDto {
  categoryId: string;
  categoryName: string;
  services: IServiceSelectionDto[],
}

export interface ICustomServiceSelectionDto {
  submissionId?: string;
  serviceName: string;
  categoryName?: string;
  price: number;
  isHomeServiceAvailable: boolean;
}

export interface IGetBeauticianServicesListDto{
   id: string;
  serviceId?: string;
  categoryId?: string;
  serviceName: string;
  categoryName?: string;
  price: number;
  isHomeServiceAvailable: boolean;
  isCustom: boolean;
}
  




export interface ICustomCategoryServiceSelectionDto {
  categoryId: null;
  categoryName: string;
  services: IServiceSelectionDto[];
  isCustomCategory: boolean;
}

export interface IGetPamphletDto{
  pamphletUrl:string
}

export interface IGetCustomServiceDto{
  beauticianId?:string,
  beauticianName:string,
  type:CategoryServiceTypes,
  profileImg:string,
  customServiceId:string,
  category:CategoryVO,
  service:ServiceVO,
  status:CustomServiceStatusType,
  createdAt:string
}

export interface IGetCategoryDto{
  categoryId:string,
  name:string,
  isActive:boolean,
  description:string,
  
 
}