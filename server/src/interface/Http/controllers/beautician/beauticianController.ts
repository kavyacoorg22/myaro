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

export class BeauticianController {
  private _beauticianRegistrationUC:IBeauticianRegisterUseCase;
  private _beauticianVerificationStatusUseCase: IBeauticianVerificationUseCase;
  private _updateRegistrationUseCase: IBeauticianUpdateRegistrationUseCase;
  private _beauticianViewEditProfileUC: IBeauticianViewEditProfileUseCase;
  private _beauticianEditProfileUC: IBeauticianEditProfileUseCase;
  private _beauticianSearchUC: ISearchResultUseCase;

  constructor(
    beauticianRegistrationUC: IBeauticianRegisterUseCase,
    verificationStatusUC: IBeauticianVerificationUseCase,
    updateRegistrationUseCase: IBeauticianUpdateRegistrationUseCase,
    beauticianViewEditProfileUC: IBeauticianViewEditProfileUseCase,
    beauticianEditProfileUS: IBeauticianEditProfileUseCase,
    beauticianSeachUC: ISearchResultUseCase
  ) {
    this._beauticianRegistrationUC = beauticianRegistrationUC;
    this._beauticianVerificationStatusUseCase = verificationStatusUC;
    this._updateRegistrationUseCase = updateRegistrationUseCase;
    this._beauticianViewEditProfileUC = beauticianViewEditProfileUC;
    this._beauticianEditProfileUC = beauticianEditProfileUS;
    this._beauticianSearchUC = beauticianSeachUC;
  }

  beauticianRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      console.log(`backend userId ${userId}`);
      if (!userId) {
        throw new AppError(
          userMessages.ERROR.UNAUTHORIZED_ACCESS,
          HttpStatus.UNAUTHORIZED
        );
      }
      const dto = (req as any).body.validatedData;

      if (!dto) {
        throw new AppError(
          "Validated request data missing",
          HttpStatus.BAD_REQUEST
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      console.log(`backend userId ${userId}`);
      if (!userId) {
        throw new AppError(
          userMessages.ERROR.UNAUTHORIZED_ACCESS,
          HttpStatus.UNAUTHORIZED
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const paymentDetails = req.body;

      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const result = await this._updateRegistrationUseCase.execute(
        userId,
        paymentDetails
      );

      console.log(`backend repsonse update registration.........${result}`);
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const profileData = await this._beauticianViewEditProfileUC.execute(
        userId
      );
      console.log("backend response edit profile data", profileData);

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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const data = req.body;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }
      if (!data) {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query.query;

      if (!query || typeof query !== "string") {
        throw new AppError(
          userMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      const beauticians = await this._beauticianSearchUC.execute(query);
      console.log(
        `search beatician controller output ${JSON.stringify(beauticians)}`
      );
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
}
