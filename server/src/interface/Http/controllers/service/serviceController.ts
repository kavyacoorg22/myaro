import { Request, Response } from "express";
import { IAddServiceUseCase } from "../../../../application/interface/beauticianService/IAddService";
import { IGetServicesUseCase } from "../../../../application/interface/beauticianService/IGetServices";
import { ITogggleActiveStatusUseCase } from "../../../../application/interface/beauticianService/IToggleActiveStatus";
import { IUpdateServiceUseCase } from "../../../../application/interface/beauticianService/IUpdateService";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { serviceMessages } from "../../../../shared/constant/message/serviceMessage";

export class ServiceController {
  constructor(
    private _addServiceUseCase: IAddServiceUseCase,
    private _updateServiceUseCase: IUpdateServiceUseCase,
    private _getAllServiceUseCase: IGetServicesUseCase,
    private _toggleActiveStatusUseCase: ITogggleActiveStatusUseCase,
  ) {}

  addService = async (req: Request, res: Response): Promise<void> => {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof categoryId !== "string") {
      throw new AppError(
        serviceMessages.ERROR.INVALID_CATEGORY_ID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const input = { name, categoryId };
    await this._addServiceUseCase.execute(input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: serviceMessages.SUCCESS.ADDED,
    });
  };

  updateService = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    const id = req.params.id;

    if (!id) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._updateServiceUseCase.execute(id, name);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.UPDATED,
    });
  };

  getServices = async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this._getAllServiceUseCase.execute(categoryId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.FETCHED,
      data: result,
    });
  };

  toggleServiceStatus = async (req: Request, res: Response): Promise<void> => {
    const { isActive } = req.body;
    const id = req.params.id;

    if (!id) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

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
}
