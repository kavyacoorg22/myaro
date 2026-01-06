import { AppError } from "../../../domain/errors/appError";
import { ISearchHistoryRepository } from "../../../domain/repositoryInterface/ISearchHistoryRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IRemoveSearchHistoryUseCase } from "../../interface/public/IRemoveSearchHistoryUseCase";
import { IResponse } from "../../interfaceType/authtypes";

export class RemoveSearchHistoryUseCase implements IRemoveSearchHistoryUseCase {
  private _searchHistoryRepo: ISearchHistoryRepository;

  constructor(searchHistoryRepo: ISearchHistoryRepository) {
    this._searchHistoryRepo = searchHistoryRepo;
  }

  async execute(searchHistoryId: string): Promise<IResponse> {
    if (!searchHistoryId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST
      );
    }

    await this._searchHistoryRepo.removeSearchHistory(searchHistoryId);

    return {
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
    };
  }
}
