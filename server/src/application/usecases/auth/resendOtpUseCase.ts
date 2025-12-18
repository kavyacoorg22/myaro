
import { IOtpRepository } from "../../../domain/repositoryInterface/IOtpRepository";
import { generateOtp, hashOtp } from "../../../utils/otpUtils";
import { NodemailerOtpService } from "../../../infrastructure/service/sendEmail";

export class ResendOtpUseCase {
  private OTP_TTL_MS = 5 * 60 * 1000;
  private MAX_RESENDS = 5;

  constructor(private otpRepo: IOtpRepository,private otpService:NodemailerOtpService) {}

  async execute(opts: { email: string; signupToken?: string | null; }) {
    const { email, signupToken = null,} = opts;
    const pending = await this.otpRepo.findLatestByEmail(email, signupToken);

    if (!pending) throw new Error("No pending OTP for this email");

    if ((pending.resendCount ?? 0) >= this.MAX_RESENDS) {
      throw new Error("Too many resend attempts try again after some time");
    }

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MS);

    await this.otpRepo.updateOtp(pending._id.toString(), {
      otpHash,
      expiresAt,
      resendCount: (pending.resendCount ?? 0) + 1,
      attempts: 0,
    });

    await this.otpService.sendOtp(email,otp);

    return { success: true, message: "OTP resent" };
  }
}
