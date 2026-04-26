import { generateOtp } from "../../../utils/otpUtils";
import { IOtpService } from "../../serviceInterface/IOtpService";
import { ICreateOtpUseCase } from "../../interface/auth/ICreateOtpUseCase";
import { ISendOtpInput } from "../../interfaceType/authtypes";
import { ISendMailService } from "../../serviceInterface/mailService";
import { authMessages } from "../../../shared/constant/message/authMessages";

export class CreateOtpUseCase implements ICreateOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _mailService: ISendMailService,
  ) {}

  async execute(input: ISendOtpInput) {
    const { email } = input;

    const otp = generateOtp(4);

    await this._otpService.setOtp(email, otp);

    await this._mailService.sendOtp(email, otp);

    return { success: true, message: authMessages.SUCCESS.OTP_SENT };
  }
}
