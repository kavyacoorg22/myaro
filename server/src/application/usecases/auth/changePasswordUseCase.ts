import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IChangePasswordUseCase } from "../../interface/auth/IChangePassword";
import { IChangePasswordInput } from "../../interfaceType/authtypes";
import bcrypt from 'bcrypt'

export class ChangePasswordUseCase implements IChangePasswordUseCase{
  constructor(private readonly _userRespository:IUserRepository){

  }

  async execute(id: string, input: IChangePasswordInput): Promise<void> {
    const {oldPassword,newPassword}=input
    const user=await this._userRespository.findByUserId(id)

    if(!user)
    {
      throw new AppError(authMessages.ERROR.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
    }

     if (!user.passwordHash) {
    throw new AppError("You haven't added a password", HttpStatus.FORBIDDEN);
  }

  
    let isPassswordCorrect=await bcrypt.compare(oldPassword,user?.passwordHash)
     
    if(!isPassswordCorrect)
    {
      throw new AppError("The current password you entered is incorrect",HttpStatus.BAD_REQUEST)
    }

    const passwordHash=await bcrypt.hash(newPassword,10)
    await this._userRespository.updateByUserId(id,{passwordHash})
    

    
  }
}