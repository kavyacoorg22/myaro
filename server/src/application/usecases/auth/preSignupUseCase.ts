import jwt, { SignOptions } from "jsonwebtoken";
import { ConflictError } from "../../../domain/errors/systemError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import {
  IPreSignupInput,
  IPreSignupOutput,
} from "../../interfaceType/authtypes";
import { IPresignupUseCase } from "../../interface/auth/IPreSignupUsecase";
import { appConfig } from "../../../infrastructure/config/config";

export class PreSignupUseCase implements IPresignupUseCase {
  constructor(private jwtSecret: string, private userRepo: IUserRepository) {}

  async execute(input: IPreSignupInput): Promise<IPreSignupOutput> {
    const { email, userName, fullName, password } = input;

    const existingByEmail = await this.userRepo.findByEmail(input.email);
    if (existingByEmail) {
      throw new ConflictError("Email alredy registered");
    }

    const existByUserName = await this.userRepo.findByUserName(input.userName);
    if (existByUserName) {
      throw new ConflictError("User Name already taken");
    }

    const signupToken = jwt.sign(
      { email, userName, fullName, password },
      this.jwtSecret,
      { expiresIn: `${appConfig.jwt.accessTokenExpireTime}m` } as any
    );

    return { signupToken };
  }
}
