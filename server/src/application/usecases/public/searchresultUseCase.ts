import { AppError } from "../../../domain/errors/appError";

import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ISearchBeauticianResultDto } from "../../dtos/beautician";
import { ISearchResultUseCase } from "../../interface/public/ISearchResultUseCase";
import { toBeauticianSearchDto } from "../../mapper/beauticianMapper";

export class SearchResultUseCase implements ISearchResultUseCase {
  constructor(private _userRepo: IUserRepository) {}
  async execute(query: string): Promise<ISearchBeauticianResultDto[]> {
    if (!query) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const searchResult = await this._userRepo.searchBeauticians(query);

    return searchResult.map(toBeauticianSearchDto);
  }
}
