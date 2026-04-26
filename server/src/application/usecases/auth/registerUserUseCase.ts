import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { UserRole } from "../../../domain/enum/userEnum";
import { IRegisterUserUseCase } from "../../interface/auth/IRegisterUserUseCase";
import { IRegisterInput, IResponse } from "../../interfaceType/authtypes";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { AppError } from "../../../domain/errors/appError";
import { userMessages } from "../../../shared/constant/message/userMessage";

export type SafeUser = Omit<User, "passwordHash">;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private bcryptRound = 10,
  ) {}

  async execute(input: IRegisterInput): Promise<IResponse> {
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

    const passwordHash = await bcrypt.hash(input.password, this.bcryptRound);
    const dto = {
      email: input.email,

      userName: input.userName,
      fullName: input.fullName,
      passwordHash,
      role: UserRole.CUSTOMER,
      isVerified: false,
      isActive: true,
    };

    await this._userRepo.create(dto);

    return { success: true, message: userMessages.SUCCESS.USER_CREATED };
  }
}
