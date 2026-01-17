import { AppError } from "../../../../../domain/errors/appError";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { adminMessages } from "../../../../../shared/constant/message/adminMessages";
import { generalMessages } from "../../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUpdateCategoryUseCase } from "../../../../interface/admin/management/services/IUpdateCategory";
import { ICategoryRequest } from "../../../../interfaceType/serviceType";

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
  private _categoryRepo: ICategoryRepository;

  constructor(categoryRepo: ICategoryRepository) {
    this._categoryRepo = categoryRepo;
  }

  async execute(id: string, input: ICategoryRequest): Promise<void> {
    if (!id) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this._categoryRepo.updateCategoryById(id, input);

    if (!result) {
      throw new AppError(
        adminMessages.ERROR.UPDATION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }
}
