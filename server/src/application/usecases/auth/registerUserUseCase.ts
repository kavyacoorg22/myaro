import { IUserRepository,CreateUserDTO } from "../../../domain/repositoryInterface/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt"
import { ConflictError } from "../../../domain/errors/systemError";

export type RegisterInput={
  email:string,
  userName:string,
  fullName:string,
  password:string,
}

export type SafeUser=Omit<User,"passwordHash">

export class RegisterUserUseCase{
  constructor(private userRepo:IUserRepository,private bcryptRound=10){}

  async execute(input:RegisterInput) {
    
    const existingByEmail=await this.userRepo.findByEmail(input.email)
    if(existingByEmail)
    {
      throw new ConflictError("Email alredy registered")
    }

    const existByUserName=await this.userRepo.findByUserName(input.userName)
    if(existByUserName)
    {
      throw new ConflictError("User Name already taken")
    }
    
    const passwordHash=await bcrypt.hash(input.password,this.bcryptRound)

    const dto:CreateUserDTO={
      email:input.email,
      userName:input.userName,
      fullName:input.fullName,
      passwordHash,
      role:"customer",
      isVerified:false
    }

    await this.userRepo.create(dto)
    // const {passwordHash:_,...safeUser}=created
    // return safeUser
    return { success: true, message: "user created" };
  }
} 