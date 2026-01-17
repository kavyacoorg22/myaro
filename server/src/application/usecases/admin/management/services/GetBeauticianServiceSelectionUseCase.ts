import { BeauticianService } from "../../../../../domain/entities/beauticianService";
import { IBeauticianServiceRepository } from "../../../../../domain/repositoryInterface/IBeauticianServiceRepository";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { ICustomServiceSelectionDto } from "../../../../dtos/services";
import { IGetBeauticianServiceSelectionUseCase } from "../../../../interface/admin/management/services/IGetBeauticianServiceSelectionUseCase";
import { IBeauticianServiceSelectionResponse } from "../../../../interfaceType/serviceType";
import { toCategoryServiceSelectionDto, toCustomServiceSelectionDto, toServiceSelectionDto } from "../../../../mapper/serviceMapper";


export class GetBeauticianServiceSelectionUseCase implements IGetBeauticianServiceSelectionUseCase{
  private _serviceRepo:IServiceRepository
  private _categoryRepo:ICategoryRepository
  private _beauticianServiceRepo:IBeauticianServiceRepository

  constructor(serverRepo:IServiceRepository,categoryRepo:ICategoryRepository,beauticianServiceRepo:IBeauticianServiceRepository)
  {
    this._serviceRepo=serverRepo,
    this._categoryRepo=categoryRepo,
    this._beauticianServiceRepo=beauticianServiceRepo
  }

async execute(beauticianId: string): Promise<IBeauticianServiceSelectionResponse> {
  const categories = await this._categoryRepo.findAllActive();
  const systemServices = await this._serviceRepo.findAllActive();
  const beauticianServices = await this._beauticianServiceRepo.findByBeauticianId(beauticianId);

  const beauticianServiceMap = new Map<string, BeauticianService>();
  const customServicesBySystemCategory = new Map<string, ICustomServiceSelectionDto[]>();
  const customServicesByCustomCategory = new Map<string, ICustomServiceSelectionDto[]>();

  for (const bs of beauticianServices) {
    if (bs.serviceId) {
      // System service selected by beautician
      beauticianServiceMap.set(bs.serviceId, bs);
    } else {
      const customServiceDto = toCustomServiceSelectionDto(bs);
      
      if (bs.categoryId) {
        //  Custom service under SYSTEM category
        if (!customServicesBySystemCategory.has(bs.categoryId)) {
          customServicesBySystemCategory.set(bs.categoryId, []);
        }
        customServicesBySystemCategory.get(bs.categoryId)!.push(customServiceDto);
      } else {
        // Custom service under CUSTOM category
        const categoryName = bs.categoryName || "Uncategorized";
        if (!customServicesByCustomCategory.has(categoryName)) {
          customServicesByCustomCategory.set(categoryName, []);
        }
        customServicesByCustomCategory.get(categoryName)!.push(customServiceDto);
      }
    }
  }

  
  const systemCategoriesDto = categories.map(category => {
    
    const systemServicesDto = systemServices
      .filter(s => s.categoryId === category.id)
      .map(service =>
        toServiceSelectionDto(
          service,
          beauticianServiceMap.get(service.id)
        )
      );

    // Get custom services for this system category
    const customServicesDto = customServicesBySystemCategory.get(category.id) || [];

    // Combine
    const allServices = [
      ...systemServicesDto,
      ...customServicesDto.map(cs => ({
        ...cs,
        isCustom: true
      }))
    ];

    return toCategoryServiceSelectionDto(
      category.id,
      category.name,
      allServices
    );
  });

  // Build custom categories 
  const customCategoriesDto = Array.from(customServicesByCustomCategory.entries()).map(
    ([categoryName, services]) => ({
      categoryId: null,  // No system category ID
      categoryName,
      services: services.map(s => ({
        ...s,
        isCustom: true
      })),
      isCustomCategory: true
    })
  );

  return {
    categories: systemCategoriesDto,
    customServices: customCategoriesDto
  };
}
  

}