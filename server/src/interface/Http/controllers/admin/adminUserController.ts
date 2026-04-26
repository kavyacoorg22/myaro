import { Request, Response } from "express";
import { IGetAllUserUseCase } from "../../../../application/interface/admin/management/IGetAllUsersUsecase";
import { SortFilter } from "../../../../domain/enum/sortFilterEnum";
import { UserFilterRole } from "../../../../domain/enum/userEnum";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { adminMessages } from "../../../../shared/constant/message/adminMessages";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { IToggleUserStatusUseCase } from "../../../../application/interface/admin/management/ItoggleUserUseCase";
import { VerificationStatusFilter } from "../../../../domain/enum/beauticianEnum";
import { IGetAllBeauticianUseCase } from "../../../../application/interface/admin/management/IGetAllBeauticianUseCase";
import { IViewBeauticianDetailsUseCase } from "../../../../application/interface/admin/management/IViewBeauticianDetailsUseCase";
import { IApproveBeauticianUseCase } from "../../../../application/interface/admin/management/IApproveBeauticianUseCase";
import { IRejectBeauticianUseCase } from "../../../../application/interface/admin/management/IRejectBeauticianUseCase";
import { authMessages } from "../../../../shared/constant/message/authMessages";

export class AdminUserManagementController {
  constructor(
    private _getAllUsersUseCase: IGetAllUserUseCase,
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase,
    private _getAllbeauticianUseCase: IGetAllBeauticianUseCase,
    private _viewBeauticianUseCase: IViewBeauticianDetailsUseCase,
    private _approveBeauticianUseCase: IApproveBeauticianUseCase,
    private _rejectBeauticianUseCase: IRejectBeauticianUseCase,
  ) {}

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this._getAllUsersUseCase.execute({
      search: req.query.search as string,
      sort: req.query.sort as SortFilter,
      role: req.query.role as UserFilterRole,
      page,
      limit,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: adminMessages.SUCCESS.FETCHED_USERS,
      data: result,
    });
  };

  toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      throw new AppError(
        generalMessages.ERROR.INVALID_STATUS,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._toggleUserStatusUseCase.execute(id, status);

    res.status(HttpStatus.OK).json({
      success: true,
      message: userMessages.SUCCESS.OPERATION_SUCCESS,
    });
    return;
  };

  getAllBeautician = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const verificationStatus = req.query
      .verificationStatus as VerificationStatusFilter;
    const sort = req.query.sort as SortFilter;

    const input = {
      sort: sort,
      verificationStatus: verificationStatus,
      page,
      limit,
    };

    const result = await this._getAllbeauticianUseCase.execute(input);

    res.status(HttpStatus.OK).json({
      success: true,
      message: adminMessages.SUCCESS.FETCHED_USERS,
      data: result,
    });
  };

  getBeauticianProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    if (!userId) {
      throw new AppError("User ID is required", HttpStatus.BAD_REQUEST);
    }

    const result = await this._viewBeauticianUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: adminMessages.SUCCESS.FETCHED_BEAUTICIAN,
      data: result,
    });
  };

  approveBeautician = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const adminId = req.user?.id || undefined;

    if (!userId) {
      throw new AppError(
        userMessages.ERROR.MISSING_PARAMETERS,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!adminId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this._approveBeauticianUseCase.execute({ userId, adminId });

    res.status(HttpStatus.OK).json({
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
    });
  };

  rejectBeautician = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const adminId = req.user?.id || undefined;
    const rejectionReason=req.body.rejectionReason
    if (!userId) {
      throw new AppError(
        userMessages.ERROR.MISSING_PARAMETERS,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!adminId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this._rejectBeauticianUseCase.execute({ userId, adminId ,rejectionReason});

    res.status(HttpStatus.OK).json({
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
    });
  };
}
