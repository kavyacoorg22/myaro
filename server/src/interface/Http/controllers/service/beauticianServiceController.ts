import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IGetBeauticianServiceSelectionUseCase } from "../../../../application/interface/beauticianService/IGetBeauticianServiceSelectionUseCase";
import { IUpsertBeauticianServiceUseCase } from "../../../../application/interface/beauticianService/IUpsertBeauticianService";
import { IGetBeauticianServicesListUseCase } from "../../../../application/interface/beauticianService/IGetBeauticianService";
import { IUploadPamphletUseCase } from "../../../../application/interface/beauticianService/IPamphletUploadUseCase";
import { IDeletePamphletUseCase } from "../../../../application/interface/beauticianService/IDeletePamphletUseCase";
import { IGetPamphletUseCase } from "../../../../application/interface/beauticianService/IGetPamphlet";

export class BeauticianServiceController {
  private _getBeauticianServiceSelectionUC: IGetBeauticianServiceSelectionUseCase;
  private _upsertBeauticianServiceUC: IUpsertBeauticianServiceUseCase;
  private _getBeauticianServiceListUC: IGetBeauticianServicesListUseCase;
  private _uploadPamphletUC: IUploadPamphletUseCase;
  private _deletePamphletUc: IDeletePamphletUseCase;
  private _getPamphletUC: IGetPamphletUseCase;
  constructor(
    getBeauticianServiceSelectionUC: IGetBeauticianServiceSelectionUseCase,
    upsertBeauticianServiceUC: IUpsertBeauticianServiceUseCase,
    getBeauticianServiceListUC: IGetBeauticianServicesListUseCase,
    uploadPampletUC: IUploadPamphletUseCase,
    deletePampletUC: IDeletePamphletUseCase,
    getPamphletUC: IGetPamphletUseCase,
  ) {
    this._getBeauticianServiceSelectionUC = getBeauticianServiceSelectionUC;
    this._upsertBeauticianServiceUC = upsertBeauticianServiceUC;
    this._getBeauticianServiceListUC = getBeauticianServiceListUC;
    this._uploadPamphletUC = uploadPampletUC;
    this._deletePamphletUc = deletePampletUC;
    this._getPamphletUC = getPamphletUC;
  }
  getBeauticianServiceSelection = async (
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

      const data =
        await this._getBeauticianServiceSelectionUC.execute(beauticianId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  upsertBeuticianService = async (
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

      await this._upsertBeauticianServiceUC.execute(data);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Services fetched",
      });
    } catch (err) {
      next(err);
    }
  };

  getBeauticianServiceList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;

      const filter = (req.query.filter as string) || "all";
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const validFilter = filter === "home" ? "home" : "all";

      const data = await this._getBeauticianServiceListUC.execute(
        beauticianId,
        validFilter,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  uploadpamphlet = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const pamphletImg = req.body;
      const id = req.user?.id;
      if (!id) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this._uploadPamphletUC.execute(id, pamphletImg);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Pamphlet Uploaded",
      });
    } catch (err) {
      next(err);
    }
  };
  deletepamphlet = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.user?.id;
      if (!id) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this._deletePamphletUc.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Pamphlet Deleted",
      });
    } catch (err) {
      next(err);
    }
  };

  getPamphlet = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId =
        req.user?.role === "beautician" ? req.user.id : req.params.beauticianId;

      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const data = await this._getPamphletUC.execute(beauticianId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  getBeauticianServiceListForCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.params.id;

      const filter = (req.query.filter as string) || "all";
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const validFilter = filter === "home" ? "home" : "all";

      const data = await this._getBeauticianServiceListUC.execute(
        beauticianId,
        validFilter,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  getPamphletForCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.params.id;

      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const data = await this._getPamphletUC.execute(beauticianId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}
