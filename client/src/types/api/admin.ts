import type { BeauticianStatusFilterType, BeauticianStatusType } from "../../constants/types/beautician";
import type { PaymentStatusType, RefundStatusType } from "../../constants/types/payment";
import type { SortFilterType } from "../../constants/types/sortFilter";
import type { UserRoleFilterType } from "../../constants/types/User";
import type { BookingTrendDto, DashboardOverviewDto, IGetAllBookingDto, IGetAllDisputesDto, IGetAllRefundsDto, IGetBookingDetailDto, IGetDisputeDetailDto, IGetRefundDetailDto, IProcessRefundDto, IReleasePayoutDto, RevenueStatsDto, UserGrowthDto } from "../dtos/admin";
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

export interface IProcessRefundInput {
  bookingId: string;
  adminNote?:string;
}

export interface IProcessRefundOutPut {
  data:IProcessRefundDto
}
export interface IReleasePayoutOutPut {
  data:IReleasePayoutDto
}

export interface IReleasePayoutInput {
  bookingId:string,
  adminNote?:string
}
export interface IGetAllBookingsInput {
  page: number;
  limit: number;
  paymentStatus?: PaymentStatusType;
}
export interface IGetAllBookingOutPutData {
  data:       IGetAllBookingDto[];
  total:      number;
  page:       number;
  totalPages: number;
  hasMore:    boolean;
}

export interface IGetBookingDetailOutPut{
data:IGetBookingDetailDto
}

export interface IGetAllDisputeOutPutData{
data:IGetAllDisputesDto[]
  total:      number;
  page:       number;
  totalPages: number;
  hasMore:    boolean;
}

export interface IGetAllDisputeInput {
  page: number;
  limit: number;
}


export interface IGetDisputeDetailOutput {
  data:IGetDisputeDetailDto
}

export interface IGetAllRefundInput {
  page: number;
  limit: number;
  status:RefundStatusType
}
export interface IGetAllRefundOutput {
  data:IGetAllRefundsDto[]
    total:      number;
  page:       number;
  totalPages: number;
  hasMore:    boolean;
}


export interface IGetRefundDetailOutput {
  data:IGetRefundDetailDto
}

export interface IUserGrowthOutPut{
  data:UserGrowthDto[]
}

export interface IRevenueOutPut{
  data:RevenueStatsDto
}

export interface IBookingTrendOutPut{
  data:BookingTrendDto[]
}

export interface IDashboardOverviewOutput {
  data: DashboardOverviewDto;
}

export type IGetAllUserResponse = BackendResponse<IGetAllUserResponseData>;
export type IGetBeauticianResponse=BackendResponse<IGetBeauticianResponseData>
export type IBeauticianProfileResponse=BackendResponse<IBeauticianProfileResponseData>
export type IApproveResponse=BackendResponse<IApproveResponseData>
export type IRejectResponse=BackendResponse<IRejectResponseData>
export type IGetAllDisputeOutput=BackendResponse<IGetAllDisputeOutPutData>
export type IGetAllBookingOutPut=BackendResponse<IGetAllBookingOutPutData>