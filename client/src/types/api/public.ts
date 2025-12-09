import type { UserRoleType } from "../../constants/types/User";
import type { BackendResponse } from "./api"



export interface profileResponseData{
  userId: string;
  userName: string;
  fullName: string;
  profileImg?: string;
  isVerified: boolean;
  role: UserRoleType;
  
  
 
  beauticianData?: {
    yearsOfExperience: number;
    about: string;
    hasShop: boolean;
    shopName?: string;
    shopAddress?: {
      address: string;
      city: string;
      pincode: string;
    };
    homeservicecount: number;
    verificationStatus: string;
  };
   
}


export interface IProfilePhotoChangeRespnseData{
  profileImg:string
}

export interface ISearchResult{
  beauticianId:string,
  userName:string,
  fullName:string,
  profileImg:string
}

export interface ISearchResponseData{
 beautician:ISearchResult[]
}

export interface IRecentSearch{
   searchHistoryId:string,
  beauticianId:string,
    userName: string;
  fullName: string;
  profileImg: string;
}


export type profileResponce=BackendResponse<profileResponseData>
export type IProfilePhotoChangeResponse=BackendResponse<IProfilePhotoChangeRespnseData>
export type ISearchResponse=BackendResponse<ISearchResponseData>
export type IRecentSearchResponse=BackendResponse<IRecentSearch[]>
