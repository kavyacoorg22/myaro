import { Request, Response } from "express";

import { ICompleteSignupUseCase } from "../../../../application/interface/auth/ICompleteSignupUseCase";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class CompleteSignupController {
  constructor(private _completeSignupUseCase: ICompleteSignupUseCase) {}

  async handle(req: Request, res: Response) {
    const { signupToken, otp } = req.body;
    const user = await this._completeSignupUseCase.execute({
      signupToken,
      otp,
    });

    return res.status(HttpStatus.CREATED).json({ success: true, message:generalMessages.SUCCESS.OPERATION_SUCCESS,data: user });
  }
}
