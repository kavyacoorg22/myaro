import { IOtpService } from "../../serviceInterface/IOtpService";
import { IVerifyOtpUseCase } from "../../interface/auth/IVerifyOtpUseCase";
import { IResponse, IVerifyOtpInput } from "../../interfaceType/authtypes";
import { AppError } from "../../../domain/errors/appError";
import { authMessages } from "../../../shared/constant/message/authMessages";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private _otpService: IOtpService) {}

  async execute(input: IVerifyOtpInput): Promise<IResponse> {
    const { email, otp } = input;

    const isValid = await this._otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new AppError(authMessages.ERROR.INVALID_OTP);
    }

    return { success: true, message: authMessages.SUCCESS.OTP_VERIFIED };
  }
}
