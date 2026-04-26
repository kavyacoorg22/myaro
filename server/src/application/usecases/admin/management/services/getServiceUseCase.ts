import { AppError } from "../../../../../domain/errors/appError";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetServicesUseCase } from "../../../../interface/beauticianService/IGetServices";
import { IGetServiceResponse } from "../../../../interfaceType/serviceType";
import { toGetServicesOutputDto } from "../../../../mapper/serviceMapper";

export class GetServiceUseCase implements IGetServicesUseCase {
  constructor(private _serviceRepo: IServiceRepository) {}
  async execute(categoryId: string): Promise<IGetServiceResponse> {
    const services =
      await this._serviceRepo.findAllServiceByCategoryId(categoryId);
    if (!services) {
      throw new AppError(
        serviceMessages.ERROR.SERVICE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const mapped = services.map((c) => toGetServicesOutputDto(c));

    return {
      services: mapped,
    };
  }
}
