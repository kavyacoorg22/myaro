import { Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../../application/interface/auth/IChangePassword";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class ChangePasswordController {
  constructor(
    private readonly _ChangePasswordUseCase: IChangePasswordUseCase,
  ) {}

  async handle(req: Request, res: Response) {
    const id = req.user?.id;
    const { oldPassword, newPassword } = req.body.input;
    if (!id) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this._ChangePasswordUseCase.execute(id, { oldPassword, newPassword });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: authMessages.SUCCESS.PASSWORD_RESET,
    });
  }
}
