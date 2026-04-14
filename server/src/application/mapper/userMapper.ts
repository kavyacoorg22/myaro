import { Notification } from "../../domain/entities/notification";
import { User } from "../../domain/entities/User";
import { INotificationDto } from "../dtos/notification";
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

export function toNotificationDto(n: Notification): INotificationDto {
  return {
    id:        n.id,
    type:      n.type,
    category:  n.category,
    title:     n.title||'',
    message:   n.message,
    metadata:  n.metadata,
    isRead:    n.isRead,
    createdAt: n.createdAt.toISOString(),
  }
}