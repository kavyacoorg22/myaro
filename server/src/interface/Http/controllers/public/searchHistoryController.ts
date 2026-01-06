import { NextFunction, Request, Response } from "express";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { IAddSearchHistoryUseCase } from "../../../../application/interface/public/IAddSearchHistoryUseCase";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IRecentSearchUseCase } from "../../../../application/interface/public/IRecentSearchUseCase";
import { IRemoveSearchHistoryUseCase } from "../../../../application/interface/public/IRemoveSearchHistoryUseCase";
import { IClearSeachHistoryUseCase } from "../../../../application/interface/public/IClearSearchHistoryUseCase";

export class SearchHistoryController {
  private _addSearchHistoryUC: IAddSearchHistoryUseCase;
  private _recentSearch: IRecentSearchUseCase;
  private _removeSeachHistoryUC: IRemoveSearchHistoryUseCase;
  private _clearSearchHistoryUseCase: IClearSeachHistoryUseCase;

  constructor(
    addSearchHistory: IAddSearchHistoryUseCase,
    recentSearch: IRecentSearchUseCase,
    removeSearchHistoryUC: IRemoveSearchHistoryUseCase,
    clearSearchHistoryUC: IClearSeachHistoryUseCase
  ) {
    this._addSearchHistoryUC = addSearchHistory;
    this._recentSearch = recentSearch;
    this._removeSeachHistoryUC = removeSearchHistoryUC;
    this._clearSearchHistoryUseCase = clearSearchHistoryUC;
  }

  addSearchHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const beauticianId = req.params.id;

      if (!userId || !beauticianId) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._addSearchHistoryUC.execute(userId, beauticianId);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  recentSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      const response = await this._recentSearch.execute(userId);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: response.data,
      });
    } catch (err) {
      next(err);
    }
  };

  removeSearchHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const searchHistoryId = req.params.id;

      if (!searchHistoryId) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._removeSeachHistoryUC.execute(searchHistoryId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  clearSearchHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._clearSearchHistoryUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };
}
