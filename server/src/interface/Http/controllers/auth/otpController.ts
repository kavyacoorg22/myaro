import { Request, Response } from "express";
import { ICreateOtpUseCase } from "../../../../application/interface/auth/ICreateOtpUseCase";
import { IResendOtpUseCase } from "../../../../application/interface/auth/IResendOtpUseCase";
import { IVerifyOtpUseCase } from "../../../../application/interface/auth/IVerifyOtpUseCase";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class OtpController {
  constructor(
    private _createOtpUseCase: ICreateOtpUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
  ) {}

  async sendOtp(req: Request, res: Response) {
    const { email, signupToken = null } = req.body;

    await this._createOtpUseCase.execute({ email, signupToken });

    return res.status(HttpStatus.OK).json({ success: true, message: authMessages.SUCCESS.OTP_SENT });
  }

  async resendOtp(req: Request, res: Response) {
    const { email, signupToken } = req.body;
    await this._resendOtpUseCase.execute({ email, signupToken });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: authMessages.SUCCESS.OTP_RESENT,
    });
  }

  async verifyOtp(req: Request, res: Response) {
    const { email, signupToken, otp } = req.body;

    await this._verifyOtpUseCase.execute({ email, signupToken, otp });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: authMessages.SUCCESS.OTP_VERIFIED,
    });
  }
}
