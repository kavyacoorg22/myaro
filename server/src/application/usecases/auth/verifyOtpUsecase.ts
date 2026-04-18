import { IOtpService } from "../../serviceInterface/IOtpService";
import { IVerifyOtpUseCase } from "../../interface/auth/IVerifyOtpUseCase";
import { IResponse, IVerifyOtpInput } from "../../interfaceType/authtypes";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private _otpService: IOtpService) {}

  async execute(input: IVerifyOtpInput): Promise<IResponse> {
    const { email, otp } = input;

    const isValid = await this._otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }

    return { success: true, message: "otp Verified" };
  }
}
