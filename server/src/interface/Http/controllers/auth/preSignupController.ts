import { Request, Response } from "express";
import { IPresignupUseCase } from "../../../../application/interface/auth/IPreSignupUsecase";
import { HttpStatus } from "../../../../shared/enum/httpStatus";

export class PreSignupController {
  constructor(private _preSignupUseCase: IPresignupUseCase) {}

  async handle(req: Request, res: Response) {
    const input = req.body;
    const result = await this._preSignupUseCase.execute(input);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }
}
