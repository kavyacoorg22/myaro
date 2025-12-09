
import { IOtpRepository } from "../../../domain/repositoryInterface/IOtpRepository";
import { generateOtp, hashOtp } from "../../../utils/otpUtils";

import { NodemailerOtpService } from "../../../infrastructure/service/sendEmail";

export class CreateOtpUseCase {
  private OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private otpRepo: IOtpRepository,private otpService:NodemailerOtpService) {}

  async execute(opts: { email: string; signupToken?: string | null;  }) {
    const { email, signupToken = null } = opts;

  
    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MS);

    await this.otpRepo.deleteByEmail(email, signupToken);

    const created = await this.otpRepo.create({
      email,
      signupToken,
      otpHash,
      expiresAt,
      });
     
    
    await this.otpService.sendOtp(email,otp);

    return { success: true, message: "OTP sent" };
  }
}
