import { BeauticianService } from "../../../../../domain/entities/beauticianService";
import { CustomService } from "../../../../../domain/entities/customService";
import {
  CategoryServiceType,
  CustomServiceStatus,
} from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianServiceRepository } from "../../../../../domain/repositoryInterface/IBeauticianServiceRepository";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IAddCustomServiceUseCase } from "../../../../interface/admin/management/services/IAddCustomService";
import { IAddCustomServiceRequest } from "../../../../interfaceType/serviceType";

export class AddCustomServiceCategoryUseCase implements IAddCustomServiceUseCase {
  private _customServiceRepo: ICustomServiceRepository;
  private _categoryRepo: ICategoryRepository;
  private _beauticianServiceRepo: IBeauticianServiceRepository;

  constructor(
    customServiceRepo: ICustomServiceRepository,
    categoryRepo: ICategoryRepository,
    beauticianServiceRepo: IBeauticianServiceRepository
  ) {
    (this._customServiceRepo = customServiceRepo),
      (this._categoryRepo = categoryRepo);
    this._beauticianServiceRepo = beauticianServiceRepo;
  }
  async execute(input: IAddCustomServiceRequest): Promise<void> {
    const { beauticianId, category } = input;

    let categoryName = category?.name;

    if (input.category.categoryId) {
      const existingCategory = await this._categoryRepo.findById(
        input.category.categoryId
      );

      if (existingCategory === null) {
        throw new AppError("category not exists", HttpStatus.CONFLICT);
      }
      categoryName = existingCategory.name;
    }

    const customServiceDto: Omit<
      CustomService,
      "id" | "createdAt" | "updatedAt"
    > = {
      type: CategoryServiceType.CUSTOM,
      beauticianId: input.beauticianId,
      category: {
        name: categoryName,
        categoryId: category?.categoryId,
      },
      service: {
        name: input.service.name,
        price: input.service.price,
        isHomeServiceAvailable: input.service.isHomeServiceAvailable,
      },
      status: CustomServiceStatus.PENDING,
    };
    //creating custom service
    const createdCustomService = await this._customServiceRepo.create(
      customServiceDto
    );

    const beauticianCustomServiceDto: Omit<
      BeauticianService,
      "id" | "createdAt" | "updatedAt"
    > = {
      beauticianId,
      categoryId: category.categoryId,
      serviceName: input.service.name,
      categoryName: categoryName,
      price: input.service.price,
      isHomeServiceAvailable: input.service.isHomeServiceAvailable,
      submissionId: createdCustomService.id,
    };
     //adding  custom service into beautician collection
    await this._beauticianServiceRepo.createOrUpdate(
      beauticianCustomServiceDto
    );
  }
}
