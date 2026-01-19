import { NextFunction, Request, Response } from "express";
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

type CustomServiceAction =
  | CustomServiceStatus.APPROVED
  | CustomServiceStatus.REJECTED;

export class CustomServiceController {
  private _addCustomServiceUC: IAddCustomServiceUseCase;
  private _getAllCustomServiceUC: IGetAllCustomServiceUseCase;
  private _getCustomServiceDetailUC: IGetCustomServiceDetailsUseCase;
  private _approveCustomServiceUC: IApproveCustomServiceUseCase;
  private _rejectCustomServiceUC: IRejectCustomServiceUseCase;

  constructor(
    addCustomService: IAddCustomServiceUseCase,
    getAllCustomServiceUC: IGetAllCustomServiceUseCase,
    getCustomServiceDetailUC: IGetCustomServiceDetailsUseCase,
    approveCustomServiceUC: IApproveCustomServiceUseCase,
    rejectCustomServiceUC: IRejectCustomServiceUseCase,
  ) {
    ((this._addCustomServiceUC = addCustomService),
      (this._getAllCustomServiceUC = getAllCustomServiceUC),
      (this._getCustomServiceDetailUC = getCustomServiceDetailUC),
      (this._approveCustomServiceUC = approveCustomServiceUC),
      (this._rejectCustomServiceUC = rejectCustomServiceUC));
  }
  addCustomService = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const data = {
        ...req.body,
        beauticianId,
      };

      await this._addCustomServiceUC.execute(data);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "custom service created",
      });
    } catch (err) {
      next(err);
    }
  };

  getAllCustomServices = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filter = (req.query.filter as CustomServiceFilter) || "today";

      const result = await this._getAllCustomServiceUC.execute(
        page,
        limit,
        filter,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Custom services fetched successfully",
        data: result.customService,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  };

  getCustomServiceDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await this._getCustomServiceDetailUC.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "custom service detail fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  updateCustomServiceStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customServiceId = req.params.id;
      const adminId = req.user?.id;
      const { status } = req.body as {
        status: CustomServiceAction;
      };

      if (!customServiceId || !adminId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const handlerMap: Record<
        CustomServiceAction,
        {
          execute: (adminId: string, serviceId: string) => Promise<void>;
        }
      > = {
        approved: this._approveCustomServiceUC,
        rejected: this._rejectCustomServiceUC,
      };
      const handler = handlerMap[status];

      if (!handler) {
        throw new AppError("Invalid status", HttpStatus.BAD_REQUEST);
      }

      await handler.execute(adminId, customServiceId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Custom service ${status} successfully`,
      });
    } catch (err) {
      next(err);
    }
  };
}

//  getBeauticianServiceSelection= async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {}catch(err)
//   {
//     next(err)
//   }

// }
