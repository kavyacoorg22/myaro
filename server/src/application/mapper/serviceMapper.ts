import { Beautician } from "../../domain/entities/Beautician";
import { BeauticianService } from "../../domain/entities/beauticianService";
import { Service } from "../../domain/entities/service";
import { ICategoryServiceSelectionDto, IGetBeauticianServicesListDto, IGetPamphletDto, IGetServiceDto, IServiceSelectionDto } from "../dtos/services";

export function toGetServicesOutputDto(service:Service):IGetServiceDto{
 return {
  id:service.id,
  name:service.name,
  categoryId:service.categoryId,
  isActive:service.isActive
 }
}

export function toServiceSelectionDto(
  service: Service,
  beauticianService?: BeauticianService
): IServiceSelectionDto {
  return {
    serviceId: service.id,
    serviceName: service.name,
    selected: !!beauticianService,
    price: beauticianService ? beauticianService.price : 0,
    isHomeServiceAvailable:
      beauticianService ? beauticianService.isHomeServiceAvailable : false,
    isCustom: false  
  };
}

export function toCustomServiceSelectionDto(
  beauticianService: BeauticianService
): IServiceSelectionDto {  
  return {
    submissionId: beauticianService.submissionId!,
    serviceName: beauticianService.serviceName,
    categoryName: beauticianService.categoryName,
    price: beauticianService.price,
    isHomeServiceAvailable: beauticianService.isHomeServiceAvailable,
    isCustom: true,  
    selected: true, 
    serviceId: beauticianService.serviceId 
  };
}

export function toCategoryServiceSelectionDto(
  categoryId: string,
  categoryName: string,
  services: IServiceSelectionDto[]
): ICategoryServiceSelectionDto {
  return {
    categoryId,
    categoryName,
    services,
  };
}

export function toGetBeauticianServiceList(service:BeauticianService):IGetBeauticianServicesListDto
{
 return{
   id:service.id,
   serviceId:service.serviceId,
   categoryId:service.categoryId,
   serviceName:service.serviceName,
   categoryName:service.categoryName,
   price:service.price,
   isHomeServiceAvailable:service.isHomeServiceAvailable,
   isCustom:!service.serviceId
 }
}

export function toGetPamphletDto(beautician:Beautician):IGetPamphletDto
{
  return{
    pamphletUrl:beautician?.pamphletUrl??''
  }
}