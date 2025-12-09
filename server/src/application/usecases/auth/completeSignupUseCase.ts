
import { VerifyOtpUseCase } from "./verifyOtpUsecase";
import { RegisterUserUseCase, RegisterInput, SafeUser } from "./registerUserUseCase";
import { ConflictError } from "../../../domain/errors/systemError";
import { verifySignupToken } from "../../../services/tokenService"; 

export class CompleteSignupUseCase {
  constructor(
    private verifyOtpUC: VerifyOtpUseCase,
    private registerUserUC: RegisterUserUseCase
  ) {}

 
  async execute(opts: { signupToken: string; otp: string }) {
    const { signupToken, otp } = opts;
    if (!signupToken) throw new Error("Missing signup token");
    if (!otp) throw new Error("Missing otp");

    // Decode token first to obtain email (used for OTP lookup)
    const payload = verifySignupToken(signupToken);
    if (!payload || typeof payload !== "object" || !("email" in payload)) {
      throw new Error("Invalid or expired signup token");
    }

    const email = (payload as any).email as string;

    await this.verifyOtpUC.execute({ email, signupToken, otp });


    const userName = (payload as any).userName as string ;
    const fullName = (payload as any).fullName as string;
    const password = (payload as any).password as string;

    if (!password) {
      throw new Error("Signup token missing password");
    }

    const registerInput: RegisterInput = {
      email,
      userName: userName ,
      fullName: fullName ?? "",
      password,
    };

    
    try {
       await this.registerUserUC.execute(registerInput);
      return { success: true };
 ;
    } catch (err) {

      if (err instanceof ConflictError) throw err;
    
      if ((err as any)?.code === 11000) {
        throw new ConflictError("Email or username already taken");
      }
      throw err;
    }
  }
}
