import { CustomServiceStatus } from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICustomServiceRepository } from "../../../../../domain/repositoryInterface/ICustomService";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IRejectCustomServiceUseCase } from "../../../../interface/admin/management/services/IRejectCustomServiceUseCase";

export class RejectCustomServiceUseCase implements IRejectCustomServiceUseCase {
  private _customServiceRepo: ICustomServiceRepository;

  constructor(customServicerepo: ICustomServiceRepository) {
    this._customServiceRepo = customServicerepo;
  }

  async execute(adminId: string, customServiceId: string): Promise<void> {
    const customService =
      await this._customServiceRepo.findById(customServiceId);
    if (!customService) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (customService.status === CustomServiceStatus.APPROVED) {
      throw new AppError(
        "Approved custom service cannot be Rejected",
        HttpStatus.CONFLICT,
      );
    }

    if (customService.status === CustomServiceStatus.REJECTED) {
      throw new AppError("Service already rejected", HttpStatus.CONFLICT);
    }

    await this._customServiceRepo.updateById(customServiceId, {
      status: CustomServiceStatus.REJECTED,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    });
  }
}
