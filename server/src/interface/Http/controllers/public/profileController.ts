import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IOwnProfileUseCase } from "../../../../application/interface/public/IProfileUsecase";
import { IProfileImageChangeUseCase } from "../../../../application/interface/public/IProfileImageChangeUseCase";

export class ProfileController {
  private _ownProfileUC: IOwnProfileUseCase;
  private _profileImageChangeUC: IProfileImageChangeUseCase;
  constructor(
    ownProfileUC: IOwnProfileUseCase,
    profileImageChange: IProfileImageChangeUseCase
  ) {
    this._ownProfileUC = ownProfileUC;
    this._profileImageChangeUC = profileImageChange;
  }

  ownProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("request reached");
      const id = req.params.id || req.user?.id;
      if (!id) {
        throw new Error("User ID is required");
      }
      const user = await this._ownProfileUC.execute(id);
      console.log(`user ${user}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: userMessages.SUCCESS.PROFILE_FETCHED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  changeProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(
        "change profile image controller reached....................."
      );
      const id = req.user?.id;
      const profileImg = req.file;
      console.log("📸 Profile image change requested:", {
        userId: id,
        hasFile: !!profileImg,
        filename: profileImg?.originalname,
        size: profileImg?.size,
      });
      if (!id) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      if (!profileImg) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      const user = await this._profileImageChangeUC.execute(id, profileImg);

      res.status(HttpStatus.OK).json({
        success: true,
        message: generalMessages.SUCCESS.OPERATION_SUCCESS,
        data: user.profileImg,
      });
    } catch (err) {
      next(err);
    }
  };
}
