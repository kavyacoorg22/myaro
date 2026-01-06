import { AppError } from "../../../domain/errors/appError";
import { ISearchHistoryRepository } from "../../../domain/repositoryInterface/ISearchHistoryRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IAddSearchHistoryUseCase } from "../../interface/public/IAddSearchHistoryUseCase";
import { IResponse } from "../../interfaceType/authtypes";

export class AddSerchHistoryUseCase implements IAddSearchHistoryUseCase {
  private _searchHistoryRepo: ISearchHistoryRepository;

  constructor(searchHistoryRepo: ISearchHistoryRepository) {
    this._searchHistoryRepo = searchHistoryRepo;
  }

  async execute(userId: string, beauticianId: string): Promise<IResponse> {
    if (!userId || !beauticianId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST
      );
    }

    await this._searchHistoryRepo.addSearchHistory(userId, beauticianId);

    return {
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
    };
  }
}
