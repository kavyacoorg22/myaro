import { Request, Response } from "express";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { IAddSearchHistoryUseCase } from "../../../../application/interface/public/IAddSearchHistoryUseCase";
import { IRecentSearchUseCase } from "../../../../application/interface/public/IRecentSearchUseCase";
import { IRemoveSearchHistoryUseCase } from "../../../../application/interface/public/IRemoveSearchHistoryUseCase";
import { IClearSeachHistoryUseCase } from "../../../../application/interface/public/IClearSearchHistoryUseCase";
import { searchHistoryMessages } from "../../../../shared/constant/message/searchHistoryMessage";

export class SearchHistoryController {
  constructor(
    private _addSearchHistoryUseCase: IAddSearchHistoryUseCase,
    private _recentSearchUseCase: IRecentSearchUseCase,
    private _removeSearchHistoryUseCase: IRemoveSearchHistoryUseCase,
    private _clearSearchHistoryUseCase: IClearSeachHistoryUseCase,
  ) {}

  addSearchHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const beauticianId = req.params.id;

    if (!userId || !beauticianId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._addSearchHistoryUseCase.execute(userId, beauticianId);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: searchHistoryMessages.SUCCESS.ADDED,
    });
  };

  recentSearch = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this._recentSearchUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: searchHistoryMessages.SUCCESS.FETCHED,
      data: response.data,
    });
  };

  removeSearchHistory = async (req: Request, res: Response): Promise<void> => {
    const searchHistoryId = req.params.id;

    if (!searchHistoryId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._removeSearchHistoryUseCase.execute(searchHistoryId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: searchHistoryMessages.SUCCESS.REMOVED,
    });
  };

  clearSearchHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._clearSearchHistoryUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: searchHistoryMessages.SUCCESS.CLEARED,
    });
  };
}
