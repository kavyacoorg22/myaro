import jwt, { SignOptions } from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import {
  IPreSignupInput,
  IPreSignupOutput,
} from "../../interfaceType/authtypes";
import { IPresignupUseCase } from "../../interface/auth/IPreSignupUsecase";
import { appConfig } from "../../../infrastructure/config/config";
import { AppError } from "../../../domain/errors/appError";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { userMessages } from "../../../shared/constant/message/userMessage";

export class PreSignupUseCase implements IPresignupUseCase {
  constructor(
    private jwtSecret: string,
    private _userRepo: IUserRepository,
  ) {}

  async execute(input: IPreSignupInput): Promise<IPreSignupOutput> {
    const { email, userName, fullName, password } = input;

    const existingByEmail = await this._userRepo.findByEmail(input.email);
    if (existingByEmail) {
      throw new AppError(
        authMessages.ERROR.EMAIL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const existByUserName = await this._userRepo.findByUserName(input.userName);
    if (existByUserName) {
      throw new AppError(
        userMessages.ERROR.USER_NAME_TAKEN,
        HttpStatus.CONFLICT,
      );
    }

    const options: SignOptions = {
      expiresIn: `${appConfig.jwt.accessTokenExpireTime}m`,
    };

    const signupToken = jwt.sign(
      { email, userName, fullName, password },
      this.jwtSecret,
      options,
    );

    return { signupToken };
  }
}
