import { AppError } from "../../../../../domain/errors/appError";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { adminMessages } from "../../../../../shared/constant/message/adminMessages";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUpdateServiceUseCase } from "../../../../interface/beauticianService/IUpdateService";

export class UpdateServiceUseCase implements IUpdateServiceUseCase {
  constructor(private _serviceRepo: IServiceRepository) {}

  async execute(id: string, name: string): Promise<void> {
    const existingService = await this._serviceRepo.findByName(name);

    if (existingService) {
      throw new AppError(
        serviceMessages.ERROR.SERVICE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this._serviceRepo.updateServiceById(id, name);
    if (!result) {
      throw new AppError(
        adminMessages.ERROR.UPDATION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
