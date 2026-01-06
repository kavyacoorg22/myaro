import { NextFunction, Request, Response } from "express";
import { IGoogleLoginUseCase } from "../../../../application/interface/auth/IGoogleLoginUseCase";
import { appConfig } from "../../../../infrastructure/config/config";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { authMessages } from "../../../../shared/constant/message/authMessages";

export class GoogleLoginController {
  private _googleLoginUseCase: IGoogleLoginUseCase;

  constructor(googleLoginUseCase: IGoogleLoginUseCase) {
    this._googleLoginUseCase = googleLoginUseCase;
  }

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential, role } = req.body;

      const result = await this._googleLoginUseCase.execute({
        credential,
        role,
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: appConfig.server.nodeEnv === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: appConfig.server.nodeEnv === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: authMessages.SUCCESS.LOGIN,
        data: {
          userId: result.user.userId,
          userName: result.user.userName,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
          profileImg: result.user.profileImg,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
