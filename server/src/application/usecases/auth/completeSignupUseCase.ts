import { ConflictError } from "../../../domain/errors/systemError";
import { verifySignupToken } from "../../../services/tokenService";
import { IVerifyOtpUseCase } from "../../interface/auth/IVerifyOtpUseCase";
import { IRegisterUserUseCase } from "../../interface/auth/IRegisterUserUseCase";
import { ICompleteSignupInput, IRegisterInput, IResponse } from "../../interfaceType/authtypes";
import { ICompleteSignupUseCase } from "../../interface/auth/ICompleteSignupUseCase";

export class CompleteSignupUseCase implements ICompleteSignupUseCase {
  constructor(
    private verifyOtpUC: IVerifyOtpUseCase,
    private registerUserUC: IRegisterUserUseCase
  ) {}

  async execute(input:ICompleteSignupInput):Promise<IResponse> {
    const { signupToken, otp } = input;
    if (!signupToken) throw new Error("Missing signup token");
    if (!otp) throw new Error("Missing otp");

    const payload = verifySignupToken(signupToken);
    if (!payload || typeof payload !== "object" || !("email" in payload)) {
      throw new Error("Invalid or expired signup token");
    }

    const email = (payload as any).email as string;

    await this.verifyOtpUC.execute({ email, signupToken, otp });

    const userName = (payload as any).userName as string;
    const fullName = (payload as any).fullName as string;
    const password = (payload as any).password as string;

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
      await this.registerUserUC.execute(registerInput);
      return { success: true, message:"User created" };
    } catch (err) {
      if (err instanceof ConflictError) throw err;

      if ((err as any)?.code === 11000) {
        throw new ConflictError("Email or username already taken");
      }
      throw err;
    }
  }
}
