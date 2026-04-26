import { Request, Response } from "express";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

import { ILogoutUseCase } from "../../../../application/interface/auth/logoutUseCase";

export class LogoutController {
  constructor(private _logoutUseCase: ILogoutUseCase) {}

  async handle(req: Request, res: Response) {
    await this._logoutUseCase.execute(req, res);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: authMessages.SUCCESS.LOGOUT,
    });
  }
}
