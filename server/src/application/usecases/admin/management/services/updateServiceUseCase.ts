import { AppError } from "../../../../../domain/errors/appError";
import { IServiceRepository } from "../../../../../domain/repositoryInterface/IServiceRepository";
import { adminMessages } from "../../../../../shared/constant/message/adminMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUpdateServiceUseCase } from "../../../../interface/beauticianService/IUpdateService";

export class UpdateServiceUseCase implements IUpdateServiceUseCase {
  private _serviceRepo: IServiceRepository;

  constructor(serviceRepo: IServiceRepository) {
    this._serviceRepo = serviceRepo;
  }

  async execute(id: string, name: string): Promise<void> {
      const existingService = await this._serviceRepo.findByName(name);

    if (existingService) {
      throw new AppError("Service is already exists", HttpStatus.BAD_REQUEST);
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
