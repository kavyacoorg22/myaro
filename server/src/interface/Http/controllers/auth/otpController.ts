// src/controllers/OtpController.ts
import { Request, Response } from "express";
import { CreateOtpUseCase } from "../../../../application/usecases/auth/createOtpUseCase";
import { ResendOtpUseCase } from "../../../../application/usecases/auth/resendOtpUseCase";
import { VerifyOtpUseCase } from "../../../../application/usecases/auth/verifyOtpUsecase";

export class OtpController {
  constructor(
    private createOtpUC: CreateOtpUseCase,
    private resendOtpUC: ResendOtpUseCase,
    private verifyOtpUC: VerifyOtpUseCase
  ) {}

  async sendOtp(req: Request, res: Response) {
    try {

      const { email, signupToken=null } = req.body;
    
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
