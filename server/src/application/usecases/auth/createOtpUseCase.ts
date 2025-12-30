
import { generateOtp,} from "../../../utils/otpUtils";
import { NodemailerOtpService } from "../../../infrastructure/service/sendEmail";
import { IOtpService } from "../../../domain/serviceInterface/IOtpService";

export class CreateOtpUseCase {

  constructor(private otpService: IOtpService,private mailService:NodemailerOtpService) {}

  async execute(opts: { email: string; signupToken?: string | null;  }) {
    const { email, signupToken = null } = opts;

  
    const otp = generateOtp(4);
    
    await this.otpService.setOtp(email,otp)
    
    await this.mailService.sendOtp(email,otp);

    return { success: true, message: "OTP sent" };
  }
}
