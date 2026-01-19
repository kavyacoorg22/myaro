import { CustomServiceFilter } from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetCustomServiceDetailsUseCase } from "../../../../interface/beauticianService/IGetCustomServiceDetails";
import { IGetCustomServiceDetailResponse } from "../../../../interfaceType/serviceType";
import { toGetAllCustomServiceDto } from "../../../../mapper/serviceMapper";

export class GetCustomServiceDetailUseCase implements IGetCustomServiceDetailsUseCase {
  private _customserviceRepo: ICustomServiceRepository;
  private _userRepo: IUserRepository;

  constructor(
    customServiceRepo: ICustomServiceRepository,
    userRepo: IUserRepository,
  ) {
    this._customserviceRepo = customServiceRepo;
    this._userRepo = userRepo;
  }
  async execute(
    customServiceId: string,
  ): Promise<IGetCustomServiceDetailResponse> {
    const customService =
      await this._customserviceRepo.findById(customServiceId);
    if (!customService) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const beautician = await this._userRepo.findByUserId(
      customService.beauticianId,
    );
    if (!beautician) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const mapped = toGetAllCustomServiceDto(customService, beautician);
    return {
      customService: mapped,
    };
  }
}
