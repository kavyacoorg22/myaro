import { Request, Response } from "express";
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
import { IViewEditProfileUseCase } from "../../../../application/interface/customer/IViewEditProfileUseCase";
import { ICustomerEditProfileUseCase } from "../../../../application/interface/customer/IEditProfileUseCase";
import { IGetBeauticianDashboardUseCase } from "../../../../application/interface/beautician/IBeauticianDashBoardUseCase";
import { beauticianMessages } from "../../../../shared/constant/message/beauticianMessage";

export class BeauticianController {
  constructor(
    private _beauticianRegistrationUseCase: IBeauticianRegisterUseCase,
    private _beauticianVerificationStatusUseCase: IBeauticianVerificationUseCase,
    private _updateRegistrationUseCase: IBeauticianUpdateRegistrationUseCase,
    private _beauticianViewEditProfileUseCase: IBeauticianViewEditProfileUseCase,
    private _beauticianEditProfileUseCase: IBeauticianEditProfileUseCase,
    private _beauticianSearchUseCase: ISearchResultUseCase,
    private _getServiceAreaUseCase: IGetServiceAreaUseCase,
    private _addServiceAreaUseCase: IAddServiceAreaUseCase,
    private _customerViewProfileUseCase: IViewEditProfileUseCase,
    private _CustomerEditProfileUseCase: ICustomerEditProfileUseCase,
    private _beauticianDashboardUseCase: IGetBeauticianDashboardUseCase,
  ) {}

  beauticianRegistration = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(
        userMessages.ERROR.UNAUTHORIZED_ACCESS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const dto = req.body.validatedData;
    console.log(dto)

    if (!dto) {
      throw new AppError(
        "Validated request data missing",
        HttpStatus.BAD_REQUEST,
      );
    }
    dto.userId = userId;

    const beautician = await this._beauticianRegistrationUseCase.execute(dto);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: beauticianMessages.SUCCESS.REGISTERED,
      data: beautician,
    });
  };

  verifiedStatus = async (req: Request, res: Response): Promise<void> => {
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
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      data: beauticianStatus,
    });
  };

  updateRegistration = async (req: Request, res: Response): Promise<void> => {
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
      message: beauticianMessages.SUCCESS.REGISTRATION_UPDATED,
      data: result,
    });
  };

  viewEditProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { id, role } = req.user;

    if (role === "customer") {
      const result = await this._customerViewProfileUseCase.execute(id);
      res.status(HttpStatus.OK).json({ data: result });
      return;
    }

    const profileData =
      await this._beauticianViewEditProfileUseCase.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.PROFILE_FETCHED,
      data: profileData,
    });
  };

  updateProfileData = async (req: Request, res: Response): Promise<void> => {
    const { id, role } = req.user!;
    const data = req.body;
    if (!id) {
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
    if (role === "customer") {
      await this._CustomerEditProfileUseCase.execute(id, data);
      res.status(HttpStatus.OK).json({
        success: true,
        message: beauticianMessages.SUCCESS.PROFILE_UPDATED,
      });
      return;
    }

    await this._beauticianEditProfileUseCase.execute(id, data);
    res.status(HttpStatus.OK).json({
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
    });
  };

  searchBeautician = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.query;

    if (!query || typeof query !== "string") {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const beauticians = await this._beauticianSearchUseCase.execute(query);

    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.SEARCH_RESULTS,
      data: {
        beautician: beauticians,
      },
    });
  };

  addServiceArea = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const {
      homeServiceableLocation,
      serviceableLocation,
    }: IAddServiceAreaRequest = req.body;
    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!homeServiceableLocation && !serviceableLocation) {
      throw new AppError(
        "At least one location must be provided",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._addServiceAreaUseCase.execute(beauticianId, {
      homeServiceableLocation,
      serviceableLocation,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.SERVICE_AREA_ADDED,
    });
  };

  getServiceArea = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const data = await this._getServiceAreaUseCase.execute(beauticianId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.SERVICE_AREA_FETCHED,
      data: data,
    });
  };

  getServiceAreaForUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.params.beauticianId;

    if (!beauticianId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    res.set("Cache-Control", "no-store");

    const data = await this._getServiceAreaUseCase.execute(beauticianId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.SERVICE_AREA_FETCHED,
      data: data,
    });
  };

  getDashboard = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    if (!beauticianId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this._beauticianDashboardUseCase.execute(beauticianId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: beauticianMessages.SUCCESS.DASHBOARD_FETCHED,
      data: result.data,
    });
  };
}
