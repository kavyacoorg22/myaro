import { ISearchHistoryRepository } from "../../../domain/repositoryInterface/ISearchHistoryRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IRecentSearchUseCase } from "../../interface/public/IRecentSearchUseCase";
import { IRecentSearchOutput } from "../../interfaceType/publicType";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { toRecentSearchHistoryResultDtos } from "../../mapper/beauticianMapper";
import { searchHistoryMessages } from "../../../shared/constant/message/searchHistoryMessage";

export class RecentSearchesUseCase implements IRecentSearchUseCase {
  constructor(
    private _searchHistoryRepo: ISearchHistoryRepository,
    private _userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<IRecentSearchOutput> {
    if (!userId || !userId.trim()) {
      throw new AppError(
        searchHistoryMessages.ERROR.INVALID_USER_ID,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const searchHistories =
        await this._searchHistoryRepo.getRecentSearches(userId);

      if (searchHistories.length === 0) {
        return {
          success: true,
          message: searchHistoryMessages.SUCCESS.EMPTY,
          data: [],
        };
      }

      const beauticianIds = searchHistories.map((sh) => sh.beauticianId);

      const beauticians =
        await this._userRepo.getBeauticiansById(beauticianIds);

      if (!beauticians || beauticians.length === 0) {
        return {
          success: true,
          message: searchHistoryMessages.SUCCESS.EMPTY,
          data: [],
        };
      }

      const beauticianMap = new Map(beauticians.map((b) => [b.id, b]));

      const dtos = toRecentSearchHistoryResultDtos(
        searchHistories,
        beauticianMap,
      );

      return {
        success: true,
        message: searchHistoryMessages.SUCCESS.FETCHED,
        data: dtos,
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        searchHistoryMessages.ERROR.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
