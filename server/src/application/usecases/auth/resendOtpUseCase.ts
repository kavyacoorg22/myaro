import { generateOtp } from "../../../utils/otpUtils";
import { NodemailerOtpService } from "../../../infrastructure/service/sendEmail";
import { IOtpService } from "../../serviceInterface/IOtpService";
import { IResendOtpUseCase } from "../../interface/auth/IResendOtpUseCase";
import { IResponse, ISendOtpInput } from "../../interfaceType/authtypes";
import { ISendMailService } from "../../serviceInterface/mailService";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _mailService: ISendMailService,
  ) {}

  async execute(input: ISendOtpInput): Promise<IResponse> {
    const { email } = input;

    const canResend = await this._otpService.resendOtp(email);

    if (!canResend) {
      return { success: false, message: "Resend limit reached. Try later." };
    }

    const otp = generateOtp(4);
    await this._otpService.setOtp(email, otp);

    await this._mailService.sendOtp(email, otp);

    return { success: true, message: "OTP resent" };
  }
}
