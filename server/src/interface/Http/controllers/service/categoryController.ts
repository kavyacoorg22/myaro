import { Request, Response } from "express";
import { IAddCategoryUseCase } from "../../../../application/interface/beauticianService/IAddCategoryUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IUpdateCategoryUseCase } from "../../../../application/interface/beauticianService/IUpdateCategory";
import { ITogggleActiveStatusUseCase } from "../../../../application/interface/beauticianService/IToggleActiveStatus";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IGetCategoryUseCase } from "../../../../application/interface/beauticianService/IGetCategoryUseCase";
import { serviceMessages } from "../../../../shared/constant/message/serviceMessage";

export class CategoryController {
  constructor(
    private _addCategoryUseCase: IAddCategoryUseCase,
    private _updateCategoryUseCase: IUpdateCategoryUseCase,
    private _toggleActiveStatusUseCase: ITogggleActiveStatusUseCase,
    private _getCategoryUseCase: IGetCategoryUseCase,
  ) {}

  addCategory = async (req: Request, res: Response): Promise<void> => {
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
      message: serviceMessages.SUCCESS.CATEGORY_CREATED,
    });
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params?.id;
    const { name, description } = req.body;

    if (!id) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const input = { name, description };
    await this._updateCategoryUseCase.execute(id, input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.CATEGORY_UPDATED,
    });
  };

  toggleCategoryStatus = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const isActive = req.body;

    if (typeof isActive !== "boolean") {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._toggleActiveStatusUseCase.execute(id, isActive);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.STATUS_CHANGED,
    });
  };

  getCategory = async (req: Request, res: Response): Promise<void> => {
    const data = await this._getCategoryUseCase.execute();

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.CATEGORY_FETCHED,
      data: data,
    });
  };
}
