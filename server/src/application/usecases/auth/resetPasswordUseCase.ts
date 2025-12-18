import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { IResetPassword } from "../../interface/auth/IResetPassword";
import {  IResetPasswordInput, IResponse } from "../../interfaceType/authtypes";
import bcrypt from "bcrypt"


export class ResetPasswordUseCase implements IResetPassword{
  private _userRepo:IUserRepository

  constructor(userRepo:IUserRepository,private bcryptRound=10 )
  {
    this._userRepo=userRepo
  }

  async execute(data: IResetPasswordInput): Promise<IResponse> {
    const {email,password}=data
    const user=await this._userRepo.findByEmail(email)
    if(!user)
    {
    throw new AppError(authMessages.ERROR.EMAIL_NOT_FOUND)
    }
  
    const passwordHash=await bcrypt.hash(password,this.bcryptRound)
    await this._userRepo.updatePassword(user.email,passwordHash)

  return {success:true, message:"Password Updated"}
}
}