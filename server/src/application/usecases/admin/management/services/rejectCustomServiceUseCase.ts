import { CustomServiceStatus } from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IRejectCustomServiceUseCase } from "../../../../interface/beauticianService/IRejectCustomServiceUseCase";

export class RejectCustomServiceUseCase implements IRejectCustomServiceUseCase {
  private _customServiceRepo: ICustomServiceRepository;

  constructor(customServicerepo: ICustomServiceRepository) {
    this._customServiceRepo = customServicerepo;
  }

  async execute(adminId: string, customServiceId: string): Promise<void> {
    const customService =
      await this._customServiceRepo.findById(customServiceId);
    if (!customService) {
      throw new AppError(
        serviceMessages.ERROR.CUSTOM_SERVICE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (customService.status === CustomServiceStatus.APPROVED) {
      throw new AppError(
        serviceMessages.ERROR.CUSTOM_SERVICE_APPROVED_CANOT_REJECT,
        HttpStatus.CONFLICT,
      );
    }

    if (customService.status === CustomServiceStatus.REJECTED) {
      throw new AppError(
        serviceMessages.ERROR.SERVICE_ALREDY_REJECTED,
        HttpStatus.CONFLICT,
      );
    }

    await this._customServiceRepo.updateById(customServiceId, {
      status: CustomServiceStatus.REJECTED,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    });
  }
}
