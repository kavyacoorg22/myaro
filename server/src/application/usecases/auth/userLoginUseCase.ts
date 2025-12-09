import { AppError } from "../../../domain/errors/appError";
import { IAuthService } from "../../../domain/serviceInterface/IAuthService";
import { ITokenService } from "../../../domain/serviceInterface/ItokenService";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ILoginUseCase } from "../../interface/auth/ILoginUseCase";
import { toLoginOutputDto } from "../../mapper/userMapper";
import { ILoginInput, ILoginOutput } from "../../interfaceType/authtypes";


export class UserLoginUseCase implements ILoginUseCase{
  private _userRepository:IUserRepository
  private _authService:IAuthService
  private _tokenService:ITokenService
  
  constructor(userRepository:IUserRepository,authService:IAuthService,tokenService:ITokenService)
  {
    this._userRepository=userRepository,
    this._authService=authService,
    this._tokenService=tokenService
  }

  async execute(input: ILoginInput): Promise<ILoginOutput> {
    const {identifier,password}=input
    const isEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    let user;
    if(isEmail)
    {
       user=await this._userRepository.findByEmail(identifier)
    }else
    {
        user=await this._userRepository.findByUserName(identifier)
    }

    if(!user || !user.passwordHash)
    {
      throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED)
    }

    const isMatch=await this._authService.comparePassword(password,user.passwordHash)
    if(!isMatch)
    {
      throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED)
    }
    if(!user.isActive)
    {
      throw new AppError(authMessages.ERROR.BLOCKED_USER,HttpStatus.FORBIDDEN)
    }

     const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.email, user.isActive);
    const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.email, user.isActive);
   
    return toLoginOutputDto(user,accessToken,refreshToken)
  }
}