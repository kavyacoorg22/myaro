import type { BeauticianStatusFilterType, BeauticianStatusType } from "../../constants/types/beautician";
import type { SortFilterType } from "../../constants/types/sortFilter";
import type { UserRoleFilterType } from "../../constants/types/User";
import type { IUserDto } from "../dtos/user";
import type { BackendResponse } from "./api";
import type { ShopAddressVO } from "./beautician";


export interface IAdminLoginRequest{
  email:string,
  password:string
}

export interface IGetUserListRequest{
   search?: string;
    sort?: SortFilterType;
    role?: UserRoleFilterType;
    page?: number;
    limit?: number
}

export interface IGetAllUserResponseData {
  user: IUserDto[];
  totalCount?: number;
}

export interface IToggleStatusRequest {
  status: 'active' | 'inactive';
}

export interface IGetBeauticianRequest{
    sort?: SortFilterType;
    verificationStatus?: BeauticianStatusFilterType;
    page?: number;
    limit?: number
}

export interface IBeauticianDTO{
 userId:string,
  userName:string,
  profileImg:string,
  verificationStatus:BeauticianStatusType,
  yearsOfExperience:number,
  shopName?:string,
  city?:string
}
export interface IGetBeauticianResponseData{
  beautician:IBeauticianDTO[],

  totalPages:number,          
  currentPage:number, 
  totalCount:number,
}



export interface IBeauticianProfileResponseData{
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


export interface IApproveResponseData{
  verificationStatus:BeauticianStatusType
}

export interface IRejectResponseData{
  verificationStatus:BeauticianStatusType
}



export type IGetAllUserResponse = BackendResponse<IGetAllUserResponseData>;
export type IGetBeauticianResponse=BackendResponse<IGetBeauticianResponseData>
export type IBeauticianProfileResponse=BackendResponse<IBeauticianProfileResponseData>
export type IApproveResponse=BackendResponse<IApproveResponseData>
export type IRejectResponse=BackendResponse<IRejectResponseData>