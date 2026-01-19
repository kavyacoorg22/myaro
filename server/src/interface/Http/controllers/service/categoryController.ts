import { NextFunction, Request, Response } from "express";
import { IAddCategoryUseCase } from "../../../../application/interface/beauticianService/IAddCategoryUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IUpdateCategoryUseCase } from "../../../../application/interface/beauticianService/IUpdateCategory";
import { ITogggleActiveStatusUseCase } from "../../../../application/interface/beauticianService/IToggleActiveStatus";
import { authMessages } from "../../../../shared/constant/message/authMessages";

export class CategoryController {
  private _addCategoryUseCase: IAddCategoryUseCase;
  private _updateCategoryUC: IUpdateCategoryUseCase;
  private _toggleActiveStatusUC: ITogggleActiveStatusUseCase;

  constructor(
    addCategoryUseCase: IAddCategoryUseCase,
    updateCategoryUC: IUpdateCategoryUseCase,
    toggleActiveStatusUC: ITogggleActiveStatusUseCase,
  ) {
    this._addCategoryUseCase = addCategoryUseCase;
    this._updateCategoryUC = updateCategoryUC;
    this._toggleActiveStatusUC = toggleActiveStatusUC;
  }

  addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.user?.id;
      const { name, description } = req.body;

      if (!id) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const input = { name, description };

      await this._addCategoryUseCase.execute(input, id);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Category created",
      });
    } catch (err) {
      next(err);
    }
  };

  updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params?.id;
      const { name, description } = req.body;

      if (!id) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const input = { name, description };
      await this._updateCategoryUC.execute(id, input);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "category Updated",
      });
    } catch (err) {
      next(err);
    }
  };

  toggleCategoryStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const isActive = req.body;

      if (typeof isActive !== "boolean") {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this._toggleActiveStatusUC.execute(id, isActive);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Status Changed",
      });
    } catch (err) {
      next(err);
    }
  };
}
