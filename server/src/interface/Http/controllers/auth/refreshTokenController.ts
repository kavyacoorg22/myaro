import { Request, Response } from "express";
import { IRefreshTokenUseCase } from "../../../../application/interface/auth/IrefreshToken";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { appConfig } from "../../../../infrastructure/config/config";

export class RefreshTokenController {
  private _refreshTokenUseCase: IRefreshTokenUseCase;
  private _cookieKey: string;

  constructor(refreshTokenUseCase: IRefreshTokenUseCase, cookieKey: string) {
    this._refreshTokenUseCase = refreshTokenUseCase;
    this._cookieKey = cookieKey;
  }

  handle = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.[this._cookieKey];

    if (!refreshToken) {
      throw new AppError(
        authMessages.ERROR.REFRESH_TOKEN_REQUIRED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { accessToken, user } =
      await this._refreshTokenUseCase.execute(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      maxAge: appConfig.jwt.accessTokenExpireTime * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: authMessages.SUCCESS.REFRESH_TOKEN_SUCCESS,
      data: {
        accessToken,
        user,
      },
    });
  };
}
