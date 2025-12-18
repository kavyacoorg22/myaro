import { User } from "../../../domain/entities/User";
import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IGoogleAuthService } from "../../../domain/serviceInterface/IGoogleAuthService";
import { ITokenService } from "../../../domain/serviceInterface/ItokenService";
import { adminMessages } from "../../../shared/constant/message/adminMessages";
import { authMessages } from "../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { UserRole } from "../../../domain/enum/userEnum"; 
import { ILoginOutputDto } from "../../dtos/user";
import { IGoogleLoginUseCase } from "../../interface/auth/IGoogleLoginUseCase";
import { IGoogleLoginInput } from "../../interfaceType/authtypes";
import { toLoginOutputDto } from "../../mapper/userMapper";

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  private _tokenService: ITokenService;
  private _userRepo: IUserRepository;
  private _googleAuthService: IGoogleAuthService;

  constructor(
    tokenService: ITokenService,
    userRepo: IUserRepository,
    googleAuthService: IGoogleAuthService,
  ) {
    this._tokenService = tokenService;
    this._userRepo = userRepo;
    this._googleAuthService = googleAuthService;
  }

  async execute(input: IGoogleLoginInput): Promise<ILoginOutputDto> {
    const { credential, role } = input;

   
    const payload = await this._googleAuthService.verifyToken(credential);

    if (!payload || !payload.email) {
      throw new AppError(authMessages.ERROR.INVALID_GOOGLE_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const { email, name, picture, sub: googleId } = payload;

    
    let user = await this._userRepo.findByEmail(email);

    if (user) {
     
      console.log(`✅ Existing user login: ${email} with role: ${user.role}`);
      
      
      if (!user.isActive) {
        throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
      }

     
      if (!user.googleId) {
        user = await this._userRepo.update(user.id!, { googleId });
      }

      if (picture && picture !== user?.profileImg) {
        user = await this._userRepo.update(user?.id!, { profileImg: picture });
      }

    } else {
      
      const userRole = role || UserRole.CUSTOMER;
      
      console.log(`✅ New user signup: ${email} with role: ${userRole}`);

      
      const baseUsername = (name || email.split('@')[0]).replace(/\s+/g, '').toLowerCase();
      let userName = baseUsername;
  
      let counter = 1;
      while (await this._userRepo.findByUserName(userName)) {
        userName = `${baseUsername}${counter}`;
        counter++;
      }

      const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'|'isVerified'> = {
        userName,
        email,
        fullName: name || email.split('@')[0],
        role: userRole,
        isActive: true,
        profileImg: picture,
        googleId,
      };

      user = await this._userRepo.create(newUser);
    }

    
    if (!user?.id) {
      throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    const accessToken = this._tokenService.generateAccessToken(
      user?.id, 
      user?.role,  
      user?.email, 
      user.isActive
    );
    
    const refreshToken = this._tokenService.generateRefreshToken(
      user.id, 
      user.role,  
      user.email, 
      user.isActive
    );

    return toLoginOutputDto(user, accessToken, refreshToken);
  }
}