import { IOtpRepository } from "../../../domain/repositoryInterface/IOtpRepository";
import { compareOtp } from "../../../utils/otpUtils";

export class VerifyOtpUseCase {
  private MAX_ATTEMPTS = 5;

  constructor(private otpRepo: IOtpRepository) {}

 
  async execute(opts: { email: string; signupToken?: string | null; otp: string }) {
    
    const { email, signupToken = null, otp } = opts;
    const pending = await this.otpRepo.findLatestByEmail(email, signupToken);
    if (!pending) throw new Error("No pending OTP found");

    if (!pending.otpHash) throw new Error("OTP not requested");
    if ((pending.expiresAt ?? new Date(0)) < new Date()) {
      await this.otpRepo.deleteByEmail(email, signupToken);
      throw new Error("OTP expired");
    }

    const ok = await compareOtp(otp, pending.otpHash);
    if (!ok) {
      const attempts = (pending.attempts ?? 0) + 1;
      await this.otpRepo.updateOtp(pending._id.toString(), { attempts });
      if (attempts >= this.MAX_ATTEMPTS) {
        await this.otpRepo.deleteByEmail(email, signupToken);
        throw new Error("Too many attempts — please start again");
      }
      throw new Error("Invalid OTP");
    }

    
    await this.otpRepo.deleteByEmail(email, signupToken);
    return { success: true };
  }
}
