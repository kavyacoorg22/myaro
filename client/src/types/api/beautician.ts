import type { BeauticianStatusType } from "../../constants/types/beautician";
import type { UserRoleType } from "../../constants/types/User";
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
  verificationStatus:BeauticianStatusType
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



export type IBeauticianProfileUpdate = Partial<IProfileUpdateRequest> & Partial<IBankDeatilUpdateRequest>;

export type IVerificationStatusResponse=BackendResponse<IVerificationStatusResponseData>
export type IBeauticianPaymentDetailResponse=BackendResponse<IBeauticianPaymentDetailResponseData>
export type IEditProfileResponse=BackendResponse<IEditProfileResponseData>