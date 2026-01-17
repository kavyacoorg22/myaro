import { BeauticianService } from "../../../../../domain/entities/beauticianService";
import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianServiceRepository } from "../../../../../domain/repositoryInterface/IBeauticianServiceRepository";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUpsertBeauticianServiceUseCase } from "../../../../interface/admin/management/services/IUpsertBeauticianService";
import { IUpsertBeauticianServiceRequest } from "../../../../interfaceType/serviceType";

export class UpsertBeauticianService
  implements IUpsertBeauticianServiceUseCase
{
  private _beauticianServiceRepo: IBeauticianServiceRepository;
  private _serviceRepo: IServiceRepository;
  private _categoryRepo: ICategoryRepository;

  constructor(
    beauticianServiceRepo: IBeauticianServiceRepository,
    serviceRepo: IServiceRepository,
    categoryRepo: ICategoryRepository
  ) {
    this._beauticianServiceRepo = beauticianServiceRepo;
    (this._serviceRepo = serviceRepo), (this._categoryRepo = categoryRepo);
  }

  async execute(input: IUpsertBeauticianServiceRequest): Promise<void> {
    const { beauticianId, serviceId, categoryId, isHomeServiceAvailable } =
      input;
    const existingCategory = await this._categoryRepo.findById(categoryId);

    if (existingCategory === null) {
      throw new AppError("category not found", HttpStatus.NOT_FOUND);
    }

    const existingService = await this._serviceRepo.findById(serviceId);
    if (existingService === null) {
      throw new AppError("Service not found", HttpStatus.NOT_FOUND);
    }

    const beauticianServiceDto: Omit<
      BeauticianService,
      "id" | "createdAt" | "updatedAt"
    > = {
      beauticianId,
      serviceId,
      categoryId,
      serviceName: existingService.name,
      categoryName: existingCategory.name,
      price: input.price,
      isHomeServiceAvailable,
    };

    await this._beauticianServiceRepo.createOrUpdate(beauticianServiceDto);
  }
}
