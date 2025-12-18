
import { ISearchHistoryRepository } from "../../../domain/repositoryInterface/ISearchHistoryRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IRecentSearchUseCase } from "../../interface/public/IRecentSearchUseCase";
import { IRecentSearchOutput } from "../../interfaceType/publicType";
import { AppError } from "../../../domain/errors/appError";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { toRecentSearchHistoryResultDtos } from "../../mapper/beauticianMapper";

export class RecentSearchesUseCase implements IRecentSearchUseCase {
  private _searchHistoryRepo: ISearchHistoryRepository;
  private _userRepo: IUserRepository;
  
  constructor(
    searchHistoryRepo: ISearchHistoryRepository,
    userRepo: IUserRepository
  ) {
    this._searchHistoryRepo = searchHistoryRepo;
    this._userRepo = userRepo;
  }
  
  async execute(userId: string): Promise<IRecentSearchOutput> {
     if (!userId || !userId.trim()) {
      throw new AppError(userMessages.ERROR.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    
  try {
    
    const searchHistories = await this._searchHistoryRepo.getRecentSearches(userId);
    
    if (searchHistories.length === 0) {
      return {
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: [],
      };
    }
    
  
    const beauticianIds = searchHistories.map(sh => sh.beauticianId);
    
    
    const beauticians = await this._userRepo.getBeauticiansById(beauticianIds);
    
  
    if (!beauticians || beauticians.length === 0) {
      return {
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: [],
      };
    }
    
    
    const beauticianMap = new Map(
      beauticians.map(b => [b.id, b])
    );
    
    
    const dtos = toRecentSearchHistoryResultDtos(
        searchHistories,
        beauticianMap
      );
    
    return {
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      data: dtos,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      generalMessages.ERROR.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  }
  
}

