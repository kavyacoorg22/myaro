import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { IForgotPasswordUseCase } from "../../interface/auth/IForgotPasswordUseCase";
import { IForgotPasswordInput, IResponse } from "../../interfaceType/authtypes";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  private _userRepo: IUserRepository;
  constructor(userRepo: IUserRepository) {
    this._userRepo = userRepo;
  }

  async execute(data: IForgotPasswordInput): Promise<IResponse> {
    const { email } = data;
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(authMessages.ERROR.EMAIL_NOT_FOUND);
    }
    return { success: true, message: "User exists" };
  }
}
