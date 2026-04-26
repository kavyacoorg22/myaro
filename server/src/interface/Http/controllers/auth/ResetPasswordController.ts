import { Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IForgotPasswordUseCase } from "../../../../application/interface/auth/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../../../../application/interface/auth/IResetPasswordUseCase";

export class ResetPasswordController {
  constructor(
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
  ) {}

  forgotpassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if (!email) {
      throw new Error(generalMessages.ERROR.BAD_REQUEST);
    }
    await this._forgotPasswordUseCase.execute({ email });

    res.status(HttpStatus.OK).json({
      success: true,
      message: userMessages.SUCCESS.EMAIL_VERIFIED,
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error(generalMessages.ERROR.BAD_REQUEST);
    }
    await this._resetPasswordUseCase.execute({ email, password });

    res.status(HttpStatus.OK).json({
      success: true,
      message: userMessages.SUCCESS.PASSWORD_UPDATED,
    });
  };
}
