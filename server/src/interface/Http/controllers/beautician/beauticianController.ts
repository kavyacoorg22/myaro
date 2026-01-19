import { NextFunction, Request, Response } from "express";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianUpdateRegistrationUseCase } from "../../../../application/interface/beautician/IbeauticianUpdateUseCase";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IBeauticianViewEditProfileUseCase } from "../../../../application/interface/beautician/IBeauticianViewEditProfileUseCase";
import { IBeauticianEditProfileUseCase } from "../../../../application/interface/beautician/IBeauticianEditProfileUseCase";
import { ISearchResultUseCase } from "../../../../application/interface/public/ISearchResultUseCase";
import { IBeauticianRegisterUseCase } from "../../../../application/interface/beautician/IBeauticianRegisterUseCase";
import { IBeauticianVerificationUseCase } from "../../../../application/interface/beautician/IbeauticianVerificationStatusUseCase";
import { IGetServiceAreaUseCase } from "../../../../application/interface/beautician/location/IGetServiceAreaUseCase";
import { IAddServiceAreaUseCase } from "../../../../application/interface/beautician/location/IaddServiceAreaUseCase";
import { IAddServiceAreaRequest } from "../../../../application/interfaceType/beauticianType";

export class BeauticianController {
  private _beauticianRegistrationUC: IBeauticianRegisterUseCase;
  private _beauticianVerificationStatusUseCase: IBeauticianVerificationUseCase;
  private _updateRegistrationUseCase: IBeauticianUpdateRegistrationUseCase;
  private _beauticianViewEditProfileUC: IBeauticianViewEditProfileUseCase;
  private _beauticianEditProfileUC: IBeauticianEditProfileUseCase;
  private _beauticianSearchUC: ISearchResultUseCase;
  private _getServiceAreaUC: IGetServiceAreaUseCase;
  private _addServiceAreaUC: IAddServiceAreaUseCase;

  constructor(
    beauticianRegistrationUC: IBeauticianRegisterUseCase,
    verificationStatusUC: IBeauticianVerificationUseCase,
    updateRegistrationUseCase: IBeauticianUpdateRegistrationUseCase,
    beauticianViewEditProfileUC: IBeauticianViewEditProfileUseCase,
    beauticianEditProfileUS: IBeauticianEditProfileUseCase,
    beauticianSeachUC: ISearchResultUseCase,
    getServiceAreaUC: IGetServiceAreaUseCase,
    addServiceAreaUC: IAddServiceAreaUseCase,
  ) {
    this._beauticianRegistrationUC = beauticianRegistrationUC;
    this._beauticianVerificationStatusUseCase = verificationStatusUC;
    this._updateRegistrationUseCase = updateRegistrationUseCase;
    this._beauticianViewEditProfileUC = beauticianViewEditProfileUC;
    this._beauticianEditProfileUC = beauticianEditProfileUS;
    this._beauticianSearchUC = beauticianSeachUC;
    this._getServiceAreaUC = getServiceAreaUC;
    this._addServiceAreaUC = addServiceAreaUC;
  }

  beauticianRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.UNAUTHORIZED_ACCESS,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const dto = req.body.validatedData;

      if (!dto) {
        throw new AppError(
          "Validated request data missing",
          HttpStatus.BAD_REQUEST,
        );
      }
      dto.userId = userId;

      const beautician = await this._beauticianRegistrationUC.execute(dto);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: userMessages.SUCCESS.OPERATION_SUCCESS,
        data: beautician,
      });
    } catch (error) {
      next(error);
    }
  };

  verifiedStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.UNAUTHORIZED_ACCESS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const beauticianStatus =
        await this._beauticianVerificationStatusUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: userMessages.SUCCESS.OPERATION_SUCCESS,
        data: beauticianStatus,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const paymentDetails = req.body;

      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this._updateRegistrationUseCase.execute(
        userId,
        paymentDetails,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  viewEditProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const profileData =
        await this._beauticianViewEditProfileUC.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: profileData,
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfileData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const data = req.body;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!data) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this._beauticianEditProfileUC.execute(userId, data);
      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  searchBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query.query;

      if (!query || typeof query !== "string") {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const beauticians = await this._beauticianSearchUC.execute(query);

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: {
          beautician: beauticians,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  addServiceArea = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const { homeServiceLocation, serviceLocation }: IAddServiceAreaRequest =
        req.body;
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!homeServiceLocation && !serviceLocation) {
        throw new AppError(
          "At least one location must be provided",
          HttpStatus.BAD_REQUEST,
        );
      }

      await this._addServiceAreaUC.execute(beauticianId, {
        homeServiceLocation,
        serviceLocation,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  getServiceArea = async (
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
      const data = await this._getServiceAreaUC.execute(beauticianId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };

  getServiceAreaForUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.params.id;
      if (!beauticianId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const data = await this._getServiceAreaUC.execute(beauticianId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}
