import type { BeauticianStatusType, ScheduleEndType, ScheduleTypeValue, ServiceModesType} from "../../constants/types/beautician";
import type { UserRoleType } from "../../constants/types/User";

import type { BeauticianDashboardDto, IGetAllPostsDto, IGetAvailabilitySlotDto, IGetBeauticianPostsDto, IGetmonthlyAvailabilityDto, IGetServiceAreaDto } from "../dtos/beautician";
import type { BackendResponse } from "./api";

export interface ShopAddressVO {
  address: string;
  city: string;
  pincode: string;
}


export interface IRegisterRequest{
   yearsOfExperience:number,
  about:string,
  portfolioImage:string[],
  certificateImage:string[],
  hasShop:boolean,
  shopName?:string,
  shopAddress?:ShopAddressVO,
  shopPhotos?: string[];
  shopLicence?: string[];
}

export interface IVerificationStatusResponseData{
  verificationStatus:BeauticianStatusType,
  rejectionReason?:string
}

export interface IBeauticianPaymentDeatilRequest{
    accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber:string,
  ifscCode: string;
  bankName: string;
  upiId?: string;
}

export interface IBeauticianPaymentDetailResponseData{
   userId:string,
  isVerified:boolean,
  role:UserRoleType
}


export interface IProfileUpdateRequest{
  userName:string,
  fullName:string;
  about:string,
  shopName?:string,
  shopAddress?:ShopAddressVO,
  yearsOfExperience:string,
  serviceModes:ServiceModesType[]
}


export interface IBankDeatilUpdateRequest{
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
}


export interface IEditProfileResponseData{
  profileImg:string,
    userName:string,
  fullName:string;
  about:string,
  shopName?:string,
  shopAddress?:ShopAddressVO,
  yearsOfExperience:string,
  serviceModes:ServiceModesType[],
  accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
}
export interface IProfileViewData extends IProfileUpdateRequest {
  profileImg?: string;
}

export interface IAddAvailabilityRequest {
  dates: string[];
  slots: Slot[];
  type:ScheduleTypeValue
}

export interface Slot{
 startTime:string,
 endTime:string
}

export interface IGetAvailabilitySlotResponseData{
  availability:IGetAvailabilitySlotDto,

}
export type Location = {
  city: string;
  lat: number|null;
  lng: number|null;
  formattedString: string;
}

export interface IAddServiceAreaRequest {
  homeServiceableLocation?: Location[];
  serviceableLocation?: Location[];
}

export interface IGetServiceAreaResponseData {
  locations: IGetServiceAreaDto;
}

export interface IAddRecursionScheduleRequest{
   rrule: string
    timeFrom?: string
    timeTo?: string
    type: ScheduleTypeValue
    startDate: Date
    endType: ScheduleEndType
    endDate?: Date
    endCount?: number
}


export interface IDeleteRecursionScheduleReuest{
    date: Date
  
}



export interface IGetAllHomeFeedResponseData{
  posts:IGetAllPostsDto[],
  nextCursor:string|null
}

export interface IGetTipsAndRentResponseData{
 posts:IGetAllPostsDto[]
 nextCursorTips:string|null,
 nextCursorRent :string|null
}


export interface IGetBeauticianPostResponseData{
  posts:IGetBeauticianPostsDto[],
  nextCursor:string|null
}

export interface IGetmonthlyAvailabilityReponseData{
  dates:IGetmonthlyAvailabilityDto[]
}

export interface IGetBeauticianDashboardResponse{
  data:BeauticianDashboardDto
}

export type IBeauticianProfileUpdate = Partial<IProfileUpdateRequest> & Partial<IBankDeatilUpdateRequest>;

export type IVerificationStatusResponse=BackendResponse<IVerificationStatusResponseData>
export type IBeauticianPaymentDetailResponse=BackendResponse<IBeauticianPaymentDetailResponseData>
export type IEditProfileResponse=BackendResponse<IEditProfileResponseData>
export type IGetAvailabilitySlotResponse=BackendResponse<IGetAvailabilitySlotResponseData>
export type IGetServiceAreaResponse=BackendResponse<IGetServiceAreaResponseData>
// export type IGetAllHomeFeedResponse=BackendResponse<IGetAllHomeFeedResponseData>
// export type IGetTipsAndRentResponse=BackendResponse<IGetTipsAndRentResponseData>
export type IGetBeauticianPostResponse=BackendResponse<IGetBeauticianPostResponseData>
export type IGetmonthlyAvailabilityReponse=BackendResponse<IGetmonthlyAvailabilityReponseData>