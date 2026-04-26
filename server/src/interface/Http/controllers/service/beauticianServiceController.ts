import { Request, Response } from "express";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IGetBeauticianServiceSelectionUseCase } from "../../../../application/interface/beauticianService/IGetBeauticianServiceSelectionUseCase";
import { IUpsertBeauticianServiceUseCase } from "../../../../application/interface/beauticianService/IUpsertBeauticianService";
import { IGetBeauticianServicesListUseCase } from "../../../../application/interface/beauticianService/IGetBeauticianService";
import { IUploadPamphletUseCase } from "../../../../application/interface/beauticianService/IPamphletUploadUseCase";
import { IDeletePamphletUseCase } from "../../../../application/interface/beauticianService/IDeletePamphletUseCase";
import { IGetPamphletUseCase } from "../../../../application/interface/beauticianService/IGetPamphlet";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { PriceFilter } from "../../../../application/interfaceType/serviceType";
import { serviceMessages } from "../../../../shared/constant/message/serviceMessage";

export class BeauticianServiceController {
  constructor(
    private _getBeauticianServiceSelectionUseCase: IGetBeauticianServiceSelectionUseCase,
    private _upsertBeauticianServiceUseCase: IUpsertBeauticianServiceUseCase,
    private _getBeauticianServiceListUseCase: IGetBeauticianServicesListUseCase,
    private _uploadPamphletUseCase: IUploadPamphletUseCase,
    private _deletePamphletUseCase: IDeletePamphletUseCase,
    private _getPamphletUseCase: IGetPamphletUseCase,
  ) {}

  getBeauticianServiceSelection = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.user?.id;

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data =
      await this._getBeauticianServiceSelectionUseCase.execute(beauticianId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.FETCHED,
      data: data,
    });
  };

  upsertBeuticianService = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
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

    await this._upsertBeauticianServiceUseCase.execute(data);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: serviceMessages.SUCCESS.UPSERTED,
    });
  };

  getBeauticianServiceList = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.user?.id;
    const filter = (req.query.filter as string) || "all";
    const priceFilter = (req.query.priceFilter as PriceFilter) || "all";

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const validFilter = filter === "home" ? "home" : "all";
    const validPriceFilters: PriceFilter[] = [
      "all",
      "low-high",
      "high-low",
      "under-500",
      "500-1000",
      "1000-2000",
      "above-2000",
    ];
    const validPriceFilter: PriceFilter = validPriceFilters.includes(
      priceFilter as PriceFilter,
    )
      ? (priceFilter as PriceFilter)
      : "all";

    const data = await this._getBeauticianServiceListUseCase.execute(
      beauticianId,
      validFilter,
      validPriceFilter,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.LIST_FETCHED,
      data: data,
    });
  };

  uploadpamphlet = async (req: Request, res: Response): Promise<void> => {
    const pamphletImg = req.file;
    const id = req.user?.id;

    if (!id) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!pamphletImg) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._uploadPamphletUseCase.execute(id, pamphletImg);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.PAMPHLET_UPLOADED,
    });
  };

  deletepamphlet = async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id;

    if (!id) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this._deletePamphletUseCase.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.PAMPHLET_DELETED,
    });
  };

  getPamphlet = async (req: Request, res: Response): Promise<void> => {
    const beauticianId =
      req.user?.role === "beautician" ? req.user.id : req.params.beauticianId;

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = await this._getPamphletUseCase.execute(beauticianId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.PAMPHLET_FETCHED,
      data: data,
    });
  };

  getBeauticianServiceListForCustomer = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.params.id;
    const filter = (req.query.filter as string) || "all";
    const priceFilter = (req.query.priceFilter as PriceFilter) || "all";

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const validFilter = filter === "home" ? "home" : "all";
    const validPriceFilters: PriceFilter[] = [
      "all",
      "low-high",
      "high-low",
      "under-500",
      "500-1000",
      "1000-2000",
      "above-2000",
    ];
    const validPriceFilter: PriceFilter = validPriceFilters.includes(
      priceFilter as PriceFilter,
    )
      ? (priceFilter as PriceFilter)
      : "all";

    const data = await this._getBeauticianServiceListUseCase.execute(
      beauticianId,
      validFilter,
      validPriceFilter,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.LIST_FETCHED,
      data: data,
    });
  };

  getPamphletForCustomer = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.params.beauticianId;

    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = await this._getPamphletUseCase.execute(beauticianId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: serviceMessages.SUCCESS.PAMPHLET_FETCHED,
      data: data,
    });
  };
}
