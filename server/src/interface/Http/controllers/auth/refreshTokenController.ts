import { NextFunction, Request, Response } from "express";
import { IRefreshTokenUseCase } from "../../../../application/interface/auth/IrefreshToken";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class RefreshTokenController {
  private _refreshTokenUseCase: IRefreshTokenUseCase;
  private _cookieKey: string;

  constructor(refreshTokenUseCase: IRefreshTokenUseCase, cookieKey: string) {
    this._refreshTokenUseCase = refreshTokenUseCase;
    this._cookieKey = cookieKey;
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[this._cookieKey];

      if (!refreshToken) {
        throw new AppError(
          authMessages.ERROR.REFRESH_TOKEN_REQUIRED,
          HttpStatus.UNAUTHORIZED
        );
      }

      // ✅ CHANGE: Get both accessToken AND user
      const { accessToken, user } = await this._refreshTokenUseCase.execute(
        refreshToken
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as const,
        maxAge: 5 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: authMessages.SUCCESS.REFRESH_TOKEN_SUCCESS,
        data: {
          accessToken,
          user, // ✅ ADD: Send user data to frontend
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
