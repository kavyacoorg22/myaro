import { NextFunction, Request, Response } from "express";
import { IAdminLoginUseCase } from "../../../../application/interface/admin/auth/ILoginUseCase";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { appConfig } from "../../../../infrastructure/config/config";

export class AdminAuthController {
  private _adminLoginUseCase: IAdminLoginUseCase;

  constructor(
    adminLoginUseCase: IAdminLoginUseCase,
    
  ) {
    this._adminLoginUseCase = adminLoginUseCase;
   
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, role } =
        await this._adminLoginUseCase.execute({ email, password });

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
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

 
}
