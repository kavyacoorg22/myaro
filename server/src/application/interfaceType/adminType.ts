import { ShopAddressVO } from "../../domain/entities/Beautician";
import {  VerificationStatusFilter } from "../../domain/enum/beauticianEnum";
import { SortFilter } from "../../domain/enum/sortFilterEnum";
import { UserRoleFilter } from "../../domain/enum/userEnum";
import { IBeauticianDTO} from "../dtos/beautician";
import { IUserDto } from "../dtos/user";


export interface IAdminLoginRequest {
    email: string,
    password: string
}

export interface IAdminLoginResponse {
    accessToken: string,
    refreshToken: string
    role:string
}

export interface IGetAllUserRequest {
    search?: string;
    sort?: SortFilter;
    role?: UserRoleFilter;
    page?: number;
    limit?: number
}

export interface IGetAllUserResponse {
    user: IUserDto[];
    totalCount?: number
}

export interface IGetAllBeauticianRequest{
    sort:SortFilter,
    verificationStatus:VerificationStatusFilter,
    page:number,
    limit:number
}

export interface IGetAllBeauticianResponse{
    beautician:IBeauticianDTO[]
    totalPages:number,         
            currentPage: number,   
            totalCount:number,
}

export interface IViewBeauticianResponse{
  userId:string,
  profileImg:string,
  userName:string,
  yearsOfExperience:number,
  shopName?:string,
  city?:string,
  about:string,
  shopAddress?:ShopAddressVO,
  portfolioImage:string[],
  shopPhotos:string[],
  certificateImage:string[],
  hasShop:boolean
}

export interface IVerificationRequest{
    userId:string,
    adminId:string,
}


 