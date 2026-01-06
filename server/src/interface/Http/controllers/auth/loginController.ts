import { NextFunction, Request, Response } from "express";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { appConfig } from "../../../../infrastructure/config/config";
import { ILoginUseCase } from "../../../../application/interface/auth/ILoginUseCase";

export class Logincontroller {
  constructor(private LoginUseCase: ILoginUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { ...input } = req.body;
      const response = await this.LoginUseCase.execute(input);

      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;

      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as const,
        path: "/",
      };

      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: Number(appConfig.jwt.accessTokenExpireTime) * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge:
          Number(appConfig.jwt.refreshTokenExpireTime) * 24 * 60 * 60 * 1000,
      });

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.status(HttpStatus.OK).json({
        success: true,
        message: authMessages.SUCCESS.LOGIN,
        data: response.user,
      });
    } catch (err) {
      next(err);
    }
  }
}
