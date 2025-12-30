import { IUserRepository,CreateUserDTO } from "../../../domain/repositoryInterface/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt"
import { ConflictError } from "../../../domain/errors/systemError";
import { UserRole } from "../../../domain/enum/userEnum";

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
      role:UserRole.CUSTOMER,
      isVerified:false,
      isActive:true
    }

    await this.userRepo.create(dto)
   
    return { success: true, message: "user created" };
  }
} 