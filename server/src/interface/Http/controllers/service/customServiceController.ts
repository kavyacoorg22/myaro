import { Request, Response } from "express";
import { IAddCustomServiceUseCase } from "../../../../application/interface/beauticianService/IAddCustomService";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IGetAllCustomServiceUseCase } from "../../../../application/interface/beauticianService/IGetCustomService";
import { IGetCustomServiceDetailsUseCase } from "../../../../application/interface/beauticianService/IGetCustomServiceDetails";
import { IRejectCustomServiceUseCase } from "../../../../application/interface/beauticianService/IRejectCustomServiceUseCase";
import { IApproveCustomServiceUseCase } from "../../../../application/interface/beauticianService/IApproveCustomServiceUseCase";
import {
  CustomServiceFilter,
  CustomServiceStatus,
} from "../../../../domain/enum/serviceEnum";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { serviceMessages } from "../../../../shared/constant/message/serviceMessage";

type CustomServiceAction =
  | CustomServiceStatus.APPROVED
  | CustomServiceStatus.REJECTED;

export class CustomServiceController {
  constructor(
    private _addCustomServiceUseCase: IAddCustomServiceUseCase,
    private _getAllCustomServiceUseCase: IGetAllCustomServiceUseCase,
    private _getCustomServiceDetailUseCase: IGetCustomServiceDetailsUseCase,
    private _approveCustomServiceUseCase: IApproveCustomServiceUseCase,
    private _rejectCustomServiceUseCase: IRejectCustomServiceUseCase,
  ) {}

  addCustomService = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = { ...req.body, beauticianId };
    await this._addCustomServiceUseCase.execute(data);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: serviceMessages.SUCCESS.CUSTOM_CREATED,
    });
  };

  getAllCustomServices = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = (req.query.filter as CustomServiceFilter) || "today";

    const result = await this._getAllCustomServiceUseCase.execute(
      page,
      limit,
      filter,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.CUSTOM_FETCHED,
      data: result,
    });
  };

  getCustomServiceDetail = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this._getCustomServiceDetailUseCase.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.CUSTOM_DETAIL_FETCHED,
      data: data,
    });
  };

  updateCustomServiceStatus = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const customServiceId = req.params.id;
    const adminId = req.user?.id;
    const { status } = req.body as { status: CustomServiceAction };

    if (!customServiceId || !adminId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const handlerMap: Record<
      CustomServiceAction,
      { execute: (adminId: string, serviceId: string) => Promise<void> }
    > = {
      approved: this._approveCustomServiceUseCase,
      rejected: this._rejectCustomServiceUseCase,
    };

    const handler = handlerMap[status];
    if (!handler) {
      throw new AppError(
        serviceMessages.ERROR.INVALID_STATUS,
        HttpStatus.BAD_REQUEST,
      );
    }

    await handler.execute(adminId, customServiceId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.CUSTOM_STATUS_UPDATED,
    });
  };
}
