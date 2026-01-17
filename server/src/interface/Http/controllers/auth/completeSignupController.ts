import { Request, Response } from "express";
import { ConflictError, getErrorMessage } from "../../../../domain/errors/systemError";
import { ICompleteSignupUseCase } from "../../../../application/interface/auth/ICompleteSignupUseCase";
import { error } from "console";

export class CompleteSignupController {
  constructor(private completeSignupUC: ICompleteSignupUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { signupToken, otp } = req.body;
      const user = await this.completeSignupUC.execute({ signupToken, otp });

      return res.status(201).json({ success: true, data: user });
    } catch (err: unknown) {
      if (err instanceof ConflictError) {
        return res.status(409).json({ success: false, error: err.message });
      }
     
       const msg = getErrorMessage(error) ?? "Server error";
     
     
      const isClientError = [
        "Invalid OTP",
        "OTP expired",
        "No pending OTP found",
        "Too many attempts — please start again",
        "Invalid or expired signup token",
        "Missing signup token",
        "Missing otp",
      ].includes(msg);

      return res
        .status(isClientError ? 400 : 500)
        .json({ success: false, error: msg });
    }
  }
}
