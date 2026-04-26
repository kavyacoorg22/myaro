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
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IAddCustomServiceUseCase } from "../../../../interface/beauticianService/IAddCustomService";
import { IAddCustomServiceRequest } from "../../../../interfaceType/serviceType";

export class AddCustomServiceCategoryUseCase implements IAddCustomServiceUseCase {
  constructor(
    private _customServiceRepo: ICustomServiceRepository,
    private _categoryRepo: ICategoryRepository,
    private _beauticianServiceRepo: IBeauticianServiceRepository,
  ) {}
  async execute(input: IAddCustomServiceRequest): Promise<void> {
    const { beauticianId, category, service } = input;

    const existingService = await this._beauticianServiceRepo.findByServiceName(
      beauticianId,
      service.name,
    );

    if (existingService) {
      throw new AppError(serviceMessages.ERROR.SERVICE_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    let categoryName = category?.name;

    if (input.category.categoryId) {
      const existingCategory = await this._categoryRepo.findById(
        input.category.categoryId,
      );

      if (existingCategory === null) {
        throw new AppError(serviceMessages.ERROR.CATEGORY_NOT_FOUND, HttpStatus.CONFLICT);
      }
      categoryName = existingCategory.name;
    } else if (input.category.name) {
      const existingCategory = await this._categoryRepo.findByName(
        input.category.name,
      );
      if (existingCategory) {
        throw new AppError(serviceMessages.ERROR.CATEGORY_ALREADY_EXISTS, HttpStatus.CONFLICT);
      }
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
    const createdCustomService =
      await this._customServiceRepo.create(customServiceDto);

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
      beauticianCustomServiceDto,
    );
  }
}
