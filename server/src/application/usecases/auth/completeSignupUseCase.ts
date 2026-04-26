import { ConflictError } from "../../../domain/errors/systemError";
import { verifySignupToken } from "../../../services/tokenService";
import { IVerifyOtpUseCase } from "../../interface/auth/IVerifyOtpUseCase";
import { IRegisterUserUseCase } from "../../interface/auth/IRegisterUserUseCase";
import {
  ICompleteSignupInput,
  IRegisterInput,
  IResponse,
} from "../../interfaceType/authtypes";
import { ICompleteSignupUseCase } from "../../interface/auth/ICompleteSignupUseCase";
import { AppError } from "../../../domain/errors/appError";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { userMessages } from "../../../shared/constant/message/userMessage";

export class CompleteSignupUseCase implements ICompleteSignupUseCase {
  constructor(
    private _verifyOtpUC: IVerifyOtpUseCase,
    private _registerUserUC: IRegisterUserUseCase,
  ) {}

  async execute(input: ICompleteSignupInput): Promise<IResponse> {
    const { signupToken, otp } = input;
    if (!signupToken)
      throw new AppError(
        authMessages.ERROR.MISSING_SIGNUP_TOKEN,
        HttpStatus.BAD_REQUEST,
      );
    if (!otp)
      throw new AppError(
        authMessages.ERROR.INVALID_OTP,
        HttpStatus.BAD_REQUEST,
      );

    const payload = verifySignupToken(signupToken);
    if (!payload || typeof payload !== "object" || !("email" in payload)) {
      throw new AppError(
        authMessages.ERROR.INVALID_SIGNUP_TOKEN,
        HttpStatus.BAD_REQUEST,
      );
    }
    type SignupPayload = {
      email: string;
      userName: string;
      fullName?: string;
      password: string;
    };

    const email = (payload as SignupPayload).email as string;

    await this._verifyOtpUC.execute({ email, signupToken, otp });
    const typedPayload = payload as SignupPayload;
    const userName = typedPayload.userName;
    const fullName = typedPayload.fullName ?? "";
    const password = typedPayload.password;

    if (!password) {
      throw new Error("Signup token missing password");
    }

    const registerInput: IRegisterInput = {
      email,
      userName: userName,
      fullName: fullName ?? "",
      password,
    };

    try {
      await this._registerUserUC.execute(registerInput);
      return { success: true, message: userMessages.SUCCESS.USER_CREATED };
    } catch (err) {
      if (err instanceof ConflictError) throw err;

      const mongoError = err as { code?: number };
      if (mongoError.code === 11000) {
        throw new ConflictError("Email or username already taken");
      }
      throw err;
    }
  }
}
