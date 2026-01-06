import { NextFunction, Request, Response } from "express";
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
  private _getAllUsersUC: IGetAllUserUseCase;
  private _toggleUserStatusUC: IToggleUserStatusUseCase;
  private _getAllbeauticianUC: IGetAllBeauticianUseCase;
  private _viewBeauticianUC: IViewBeauticianDetailsUseCase;
  private _approveBeauticianUC: IApproveBeauticianUseCase;
  private _rejectBeauticianUC: IRejectBeauticianUseCase;

  constructor(
    getAllUsersUC: IGetAllUserUseCase,
    toggleUserUSeCase: IToggleUserStatusUseCase,
    getAllBeauticianUC: IGetAllBeauticianUseCase,
    viewprofile: IViewBeauticianDetailsUseCase,
    approveBeautician: IApproveBeauticianUseCase,
    rejectBeautician: IRejectBeauticianUseCase
  ) {
    this._getAllUsersUC = getAllUsersUC;
    this._toggleUserStatusUC = toggleUserUSeCase;
    this._getAllbeauticianUC = getAllBeauticianUC;
    this._viewBeauticianUC = viewprofile;
    this._approveBeauticianUC = approveBeautician;
    this._rejectBeauticianUC = rejectBeautician;
  }

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this._getAllUsersUC.execute({
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
    } catch (error) {
      next(error);
    }
  };

  toggleUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      if (!["active", "inactive"].includes(status)) {
        throw new AppError(
          generalMessages.ERROR.INVALID_STATUS,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._toggleUserStatusUC.execute(id, status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: userMessages.SUCCESS.OPERATION_SUCCESS,
      });
      return;
    } catch (error) {
      next(error);
    }
  };

  getAllBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
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

      const result = await this._getAllbeauticianUC.execute(input);

      res.status(HttpStatus.OK).json({
        success: true,
        message: adminMessages.SUCCESS.FETCHED_USERS,
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller error:", error);
      next(error);
    }
  };

  getBeauticianProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      if (!userId) {
        throw new AppError("User ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this._viewBeauticianUC.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Beautician profile fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller error:", error);
      next(error);
    }
  };

  approveBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const adminId = req.user?.id || undefined;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.MISSING_PARAMETERS,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!adminId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }
      await this._approveBeauticianUC.execute({ userId, adminId });

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (error) {
      console.error("❌ Controller error:", error);
      next(error);
    }
  };

  rejectBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const adminId = req.user?.id || undefined;

      if (!userId) {
        throw new AppError(
          userMessages.ERROR.MISSING_PARAMETERS,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!adminId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }
      await this._rejectBeauticianUC.execute({ userId, adminId });

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      });
    } catch (error) {
      console.error("❌ Controller error:", error);
      next(error);
    }
  };
}
