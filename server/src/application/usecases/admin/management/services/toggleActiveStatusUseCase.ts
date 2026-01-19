import { AppError } from "../../../../../domain/errors/appError";
import { IToggleActiveStatusRepository } from "../../../../../domain/repositoryInterface/IToggleActiveRepository";
import { adminMessages } from "../../../../../shared/constant/message/adminMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { ITogggleActiveStatusUseCase } from "../../../../interface/beauticianService/IToggleActiveStatus";

export class toggleActiveStatusUseCase implements ITogggleActiveStatusUseCase {
  private _repository: IToggleActiveStatusRepository;
  constructor(repository: IToggleActiveStatusRepository) {
    this._repository = repository;
  }

  async execute(id: string, isActive: boolean): Promise<void> {
    const result = await this._repository.toggleActive(id, isActive);

    if (!result) {
      throw new AppError(
        adminMessages.ERROR.UPDATION_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
