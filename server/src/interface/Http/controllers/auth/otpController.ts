import { Request, Response } from "express";

import { ICreateOtpUseCase } from "../../../../application/interface/auth/ICreateOtpUseCase";
import { IResendOtpUseCase } from "../../../../application/interface/auth/IResendOtpUseCase";
import { IVerifyOtpUseCase } from "../../../../application/interface/auth/IVerifyOtpUseCase";

export class OtpController {
  constructor(
    private createOtpUC: ICreateOtpUseCase,
    private resendOtpUC: IResendOtpUseCase,
    private verifyOtpUC: IVerifyOtpUseCase
  ) {}

  async sendOtp(req: Request, res: Response) {
    try {
      const { email, signupToken = null } = req.body;

      await this.createOtpUC.execute({ email, signupToken });

      return res.json({ success: true, message: "OTP sent" });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email, signupToken } = req.body;
      await this.resendOtpUC.execute({ email, signupToken });
      return res.json({ success: true, message: "OTP resent" });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, signupToken, otp } = req.body;

      await this.verifyOtpUC.execute({ email, signupToken, otp });

      return res.json({ success: true, message: "OTP verified" });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
