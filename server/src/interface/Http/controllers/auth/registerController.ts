import { Request, Response } from "express";
import { ConflictError } from "../../../../domain/errors/systemError";
import { IRegisterUserUseCase } from "../../../../application/interface/auth/IRegisterUserUseCase";

export class RegisterUserController {
  constructor(private RegisterUserUseCase: IRegisterUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { ...input } = req.body;

      const user = await this.RegisterUserUseCase.execute(input);

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (err) {
      if (err instanceof ConflictError) {
        return res.status(409).json({
          success: false,
          error: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
