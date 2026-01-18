import {
  CategoryServiceType,
  CustomServiceStatus,
} from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IApproveCustomServiceUseCase } from "../../../../interface/admin/management/services/IApproveCustomServiceUseCase";

export class ApproveCustomServiceUseCase implements IApproveCustomServiceUseCase {
  private _customServiceRepo: ICustomServiceRepository;
  private _serviceRepo: IServiceRepository;
  private _categoryRepo: ICategoryRepository;
  constructor(
    customServicerepo: ICustomServiceRepository,
    serviceRepo: IServiceRepository,
    categoryRepo: ICategoryRepository,
  ) {
    this._customServiceRepo = customServicerepo;
    this._serviceRepo = serviceRepo;
    this._categoryRepo = categoryRepo;
  }
  async execute(adminId: string, customServiceId: string): Promise<void> {
    const customService =
      await this._customServiceRepo.findById(customServiceId);
    if (!customService) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (customService.status === CustomServiceStatus.APPROVED) {
      throw new AppError(
        "Custom service is already approved",
        HttpStatus.CONFLICT,
      );
    }

    if (customService.status === CustomServiceStatus.REJECTED) {
      throw new AppError(
        "Rejected custom service cannot be approved",
        HttpStatus.CONFLICT,
      );
    }

    let categoryId = customService.category.categoryId;
    let serviceId: string;

    if (categoryId && customService.type === CategoryServiceType.CUSTOM) {
      const service = await this._serviceRepo.create({
        name: customService.service.name,
        categoryId,
        suggestedPrice: customService.service.price,
        isActive: true,
      });

      serviceId = service?.id ?? "";
    } else {
      const category = await this._categoryRepo.create({
        name: customService.category.name!,
        type: CategoryServiceType.CUSTOM,
        createdBy: adminId,
        isActive: true,
        description: "",
      });

      categoryId = category.id;

      const service = await this._serviceRepo.create({
        name: customService.service.name,
        categoryId,
        suggestedPrice: customService.service.price,
        isActive: true,
      });

      serviceId = service?.id ?? "";
    }

    await this._customServiceRepo.updateById(customServiceId, {
      status: CustomServiceStatus.APPROVED,
      type: CategoryServiceType.SYSTEM,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      result: {
        categoryId,
        serviceId,
      },
    });
  }
}
