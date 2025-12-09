import { User } from "../../domain/entities/User";
import { ILoginOutputDto, IUserDto } from "../dtos/user";


export function toLoginOutputDto(user: User, accessToken: string, refreshToken: string): ILoginOutputDto {
    return {
        user: {
          userId:user.id,
            fullName:user.fullName,
            userName:user.userName,
            email: user.email,
            role: user.role,
            profileImg: user.profileImg,
            isVerified:user.isVerified
        },
        accessToken,
        refreshToken,
        
    };
}

export function toUserDetailDto(user: IUserDto): IUserDto {
    return {
        id: user.id,
        userName: user.userName,
        fullName:user.fullName,
        email: user.email,
        role: user.role,
     isActive: user.isActive !== undefined ? user.isActive : true,
    };
};

export function  toProfileImageChangeDto(user:IUserDto):Partial<IUserDto>{
    return {
        profileImg:user.profileImg
    }
}