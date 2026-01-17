import { Service } from "../../../../../domain/entities/service";
import { AppError } from "../../../../../domain/errors/appError";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetServicesUseCase } from "../../../../interface/admin/management/services/IGetServices";
import { IGetServiceResponse } from "../../../../interfaceType/serviceType";
import { toGetServicesOutputDto } from "../../../../mapper/serviceMapper";

export class GetServiceUseCase implements IGetServicesUseCase {
  private _serviceRepo: IServiceRepository;

  constructor(serviceRepo: IServiceRepository) {
    this._serviceRepo = serviceRepo;
  }
  async execute(categoryId: string): Promise<IGetServiceResponse> {
    const services = await this._serviceRepo.findByCategoryId(categoryId);
    if (!services) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const mapped = services.map((c) => toGetServicesOutputDto(c));

    return {
      services: mapped,
    };
  }
}
