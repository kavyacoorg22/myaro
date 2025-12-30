
import { IOtpService } from "../../../domain/serviceInterface/IOtpService";


export class VerifyOtpUseCase {
 
  constructor(private otpService: IOtpService) {}

 
  async execute(opts: { email: string; signupToken?: string | null; otp: string }) {
    
    const { email, signupToken = null, otp } = opts;

      const isValid = await this.otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }
    
    return { success: true };
  }
}
