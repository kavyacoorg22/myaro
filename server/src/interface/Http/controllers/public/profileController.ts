import { Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { AppError } from "../../../../domain/errors/appError";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IOwnProfileUseCase } from "../../../../application/interface/public/IProfileUsecase";
import { IProfileImageChangeUseCase } from "../../../../application/interface/public/IProfileImageChangeUseCase";

export class ProfileController {
  constructor(
    private _ownProfileUseCase: IOwnProfileUseCase,
    private _profileImageChangeUseCase: IProfileImageChangeUseCase,
  ) {}

  ownProfile = async (req: Request, res: Response): Promise<void> => {
    const targetId = req.params.id || req.user?.id;
    const requesterId = req.user?.id;

    if (!targetId) {
      throw new Error("User ID is required");
    }

    const user = await this._ownProfileUseCase.execute(targetId, requesterId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: userMessages.SUCCESS.PROFILE_FETCHED,
      data: user,
    });
  };

  changeProfileImage = async (req: Request, res: Response): Promise<void> => {
    const id = req.user?.id;
    const profileImg = req.file;

    if (!id) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!profileImg) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this._profileImageChangeUseCase.execute(id, profileImg);

    res.status(HttpStatus.OK).json({
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS,
      data: user.profileImg,
    });
  };
}
