import {
  IUserRepository,
  CreateUserDTO,
} from "../../../domain/repositoryInterface/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { ConflictError } from "../../../domain/errors/systemError";
import { UserRole } from "../../../domain/enum/userEnum";
import { IRegisterUserUseCase } from "../../interface/auth/IRegisterUserUseCase";
import { IRegisterInput, IResponse } from "../../interfaceType/authtypes";

export type SafeUser = Omit<User, "passwordHash">;

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(private userRepo: IUserRepository, private bcryptRound = 10) {}

  async execute(input: IRegisterInput): Promise<IResponse> {
    const existingByEmail = await this.userRepo.findByEmail(input.email);
    if (existingByEmail) {
      throw new ConflictError("Email alredy registered");
    }

    const existByUserName = await this.userRepo.findByUserName(input.userName);
    if (existByUserName) {
      throw new ConflictError("User Name already taken");
    }

    const passwordHash = await bcrypt.hash(input.password, this.bcryptRound);

    const dto: CreateUserDTO = {
      email: input.email,
      userName: input.userName,
      fullName: input.fullName,
      passwordHash,
      role: UserRole.CUSTOMER,
      isVerified: false,
      isActive: true,
    };

    await this.userRepo.create(dto);

    return { success: true, message: "user created" };
  }
}
