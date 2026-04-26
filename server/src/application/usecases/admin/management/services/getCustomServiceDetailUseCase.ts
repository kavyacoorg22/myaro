import { AppError } from "../../../../../domain/errors/appError";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { beauticianMessages } from "../../../../../shared/constant/message/beauticianMessage";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetCustomServiceDetailsUseCase } from "../../../../interface/beauticianService/IGetCustomServiceDetails";
import { IGetCustomServiceDetailResponse } from "../../../../interfaceType/serviceType";
import { toGetAllCustomServiceDto } from "../../../../mapper/serviceMapper";

export class GetCustomServiceDetailUseCase implements IGetCustomServiceDetailsUseCase {
  constructor(
    private _customserviceRepo: ICustomServiceRepository,
    private _userRepo: IUserRepository,
  ) {}
  async execute(
    customServiceId: string,
  ): Promise<IGetCustomServiceDetailResponse> {
    const customService =
      await this._customserviceRepo.findById(customServiceId);
    if (!customService) {
      throw new AppError(serviceMessages.ERROR.CUSTOM_SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const beautician = await this._userRepo.findByUserId(
      customService.beauticianId,
    );
    if (!beautician) {
      throw new AppError(beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const mapped = toGetAllCustomServiceDto(customService, beautician);
    return {
      customService: mapped,
    };
  }
}
