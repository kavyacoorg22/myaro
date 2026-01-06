import { generateOtp } from "../../../utils/otpUtils";
import { NodemailerOtpService } from "../../../infrastructure/service/sendEmail";
import { IOtpService } from "../../../domain/serviceInterface/IOtpService";
import { ICreateOtpUseCase } from "../../interface/auth/ICreateOtpUseCase";
import { ISendOtpInput } from "../../interfaceType/authtypes";
import { ISendMailService } from "../../../domain/serviceInterface/mailService";

export class CreateOtpUseCase implements ICreateOtpUseCase {
  constructor(
    private otpService: IOtpService,
    private mailService: ISendMailService
  ) {}

  async execute(input: ISendOtpInput) {
    const { email } = input;

    const otp = generateOtp(4);

    await this.otpService.setOtp(email, otp);

    await this.mailService.sendOtp(email, otp);

    return { success: true, message: "OTP sent" };
  }
}
