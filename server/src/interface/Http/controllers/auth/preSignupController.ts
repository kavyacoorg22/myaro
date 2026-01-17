import { Request, Response } from "express";
import { IPresignupUseCase } from "../../../../application/interface/auth/IPreSignupUsecase";
import { getErrorMessage } from "../../../../domain/errors/systemError";

export class PreSignupController {
  constructor(private preSignupUseCase: IPresignupUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const input = req.body;
      const result = await this.preSignupUseCase.execute(input);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: unknown) {
      return res.status(400).json({
        success: false,
        error: getErrorMessage(err),
      });
    }
  }
}
