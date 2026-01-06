import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IForgotPasswordUseCase } from "../../../../application/interface/auth/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../../../application/interface/auth/IResetPasswordUseCase";

export class ResetPasswordController {
  private _forgotPassword: IForgotPasswordUseCase;
  private _resetPassword: IResetPasswordUseCase;

  constructor(
    forgotPassword: IForgotPasswordUseCase,
    resetPassword: IResetPasswordUseCase
  ) {
    this._forgotPassword = forgotPassword;
    this._resetPassword = resetPassword;
  }

  forgotpassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error(generalMessages.ERROR.BAD_REQUEST);
      }
      await this._forgotPassword.execute({ email });

      res.status(HttpStatus.OK).json({
        success: true,
        message: userMessages.SUCCESS.EMAIL_VERIFIED,
      });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      console.log("backend request", email, password);
      if (!email || !password) {
        throw new Error(generalMessages.ERROR.BAD_REQUEST);
      }
      await this._resetPassword.execute({ email, password });

      res.status(HttpStatus.OK).json({
        success: true,
        message: userMessages.SUCCESS.PASSWORD_UPDATED,
      });
    } catch (err) {
      next(err);
    }
  };
}
