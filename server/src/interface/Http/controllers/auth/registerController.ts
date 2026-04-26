import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../../application/interface/auth/IRegisterUserUseCase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class RegisterUserController {
  constructor(private _registerUserUseCase: IRegisterUserUseCase) {}

  async handle(req: Request, res: Response) {
    const { ...input } = req.body;

    const user = await this._registerUserUseCase.execute(input);

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: user,
    });
  }
}
