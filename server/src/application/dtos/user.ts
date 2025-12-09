import { UserRole } from "../../domain/enum/userEnum";

export interface ILoginOutputDto {
    user: {
      userId:string,
        fullName: string;
        userName:string,
        email: string;
        role: UserRole;
        profileImg?: string;
        isVerified:boolean
    };
    accessToken:string,
    refreshToken:string


}




export interface IUserDto {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive?: boolean;
     profileImg?: string;
}


export interface SearchHistoryDto {
  id: string;
  userId: string;
  beauticianId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IRecentSearchDto{
   searchHistoryId:string,
  beauticianId:string,
    userName: string;
  fullName: string;
  profileImg: string;
}