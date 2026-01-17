import { Service } from "../../../../../domain/entities/service";
import { AppError } from "../../../../../domain/errors/appError";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IAddServiceUseCase } from "../../../../interface/admin/management/services/IAddService";
import { IAddServiceRequest } from "../../../../interfaceType/serviceType";

export class AddServiceUseCase implements IAddServiceUseCase {
  private _serviceRepo: IServiceRepository;
  private _categoryrepository: ICategoryRepository;
  constructor(
    serviceRepo: IServiceRepository,
    categoryRepository: ICategoryRepository
  ) {
    this._serviceRepo = serviceRepo;
    this._categoryrepository = categoryRepository;
  }

  async execute(input: IAddServiceRequest): Promise<void> {
    const { name, categoryId } = input;
    const existingCategory = await this._categoryrepository.findById(
      categoryId
    );
    if (!existingCategory) {
      throw new AppError("Category is not exists", HttpStatus.BAD_REQUEST);
    }

    const existingService = await this._serviceRepo.findByName(name);

    if (existingService) {
      throw new AppError("Service is already exists", HttpStatus.BAD_REQUEST);
    }

    const ServiceDto: Omit<Service, "id" | "createdAt" | "updatedAt"> = {
      name,
      categoryId,
      suggestedPrice: 0,
      isActive: true,
    };

    await this._serviceRepo.create(ServiceDto);
    
  }
}
