import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IGetBeauticianServiceSelectionUseCase } from "../../../../application/interface/admin/management/services/IGetBeauticianServiceSelectionUseCase";
import { IUpsertBeauticianServiceUseCase } from "../../../../application/interface/admin/management/services/IUpsertBeauticianService";
import { IGetBeauticianServicesListUseCase } from "../../../../application/interface/admin/management/services/IGetBeauticianService";
import { IUploadPamphletUseCase } from "../../../../application/interface/admin/management/services/IPamphletUploadUseCase";
import { IDeletePamphletUseCase } from "../../../../application/interface/admin/management/services/IDeletePamphletUseCase";
import { IGetPamphletUseCase } from "../../../../application/interface/admin/management/services/IGetPamphlet";

export class BeauticianServiceController {
  private _getBeauticianServiceSelectionUC: IGetBeauticianServiceSelectionUseCase;
  private _upsertBeauticianServiceUC: IUpsertBeauticianServiceUseCase;
  private _getBeauticianServiceListUC: IGetBeauticianServicesListUseCase;
  private _uploadPamphletUC:IUploadPamphletUseCase
  private _deletePamphletUc:IDeletePamphletUseCase
  private _getPamphletUC:IGetPamphletUseCase
  constructor(
    getBeauticianServiceSelectionUC: IGetBeauticianServiceSelectionUseCase,
    upsertBeauticianServiceUC: IUpsertBeauticianServiceUseCase,
    getBeauticianServiceListUC: IGetBeauticianServicesListUseCase,
    uploadPampletUC:IUploadPamphletUseCase,
    deletePampletUC:IDeletePamphletUseCase,
    getPamphletUC:IGetPamphletUseCase
  ) {
    this._getBeauticianServiceSelectionUC = getBeauticianServiceSelectionUC;
    this._upsertBeauticianServiceUC = upsertBeauticianServiceUC;
    this._getBeauticianServiceListUC = getBeauticianServiceListUC;
    this._uploadPamphletUC=uploadPampletUC
    this._deletePamphletUc=deletePampletUC
    this._getPamphletUC=getPamphletUC
  }
  getBeauticianServiceSelection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;

      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const data = await this._getBeauticianServiceSelectionUC.execute(
        beauticianId
      );
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
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
    next: NextFunction
  ): Promise<void> => {
    try {
    const beauticianId =req.user?.role === "beautician"
    ? req.user.id
    : req.params.beauticianId;
     
    const filter = (req.query.filter as string) || "all"
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }
      const validFilter = filter === "home" ? "home" : "all";

      const data = await this._getBeauticianServiceListUC.execute(beauticianId,validFilter);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  uploadpamphlet= async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pamphletImg=req.body;
      const id=req.user?.id
      if(!id)
      {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
      }
      await this._uploadPamphletUC.execute(id,pamphletImg)
         res.status(HttpStatus.OK).json({
        success: true,
        message: "Pamphlet Uploaded",
      });
    }catch(err)
    {
      next(err)
    }

  }
    deletepamphlet= async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id=req.user?.id
      if(!id)
      {
        throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
      }
      await this._deletePamphletUc.execute(id)
         res.status(HttpStatus.OK).json({
        success: true,
        message: "Pamphlet Deleted",
      });
    }catch(err)
    {
      next(err)
    }

  }

  getPamphlet=async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
     const beauticianId =
    req.user?.role === "beautician"
    ? req.user.id
    : req.params.beauticianId;
    
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const data=await this._getPamphletUC.execute(beauticianId)

        res.status(HttpStatus.OK).json({
        success: true,
        message: "Services List fetched",
        data: data,
      });

    }catch(err)
    {
      next(err)
    }

  }
}
