import { ServiceModes } from "../../domain/enum/beauticianEnum";



export interface IOwnProfileOutput{
  userId: string;
  userName: string;
  fullName?: string;
  profileImg?: string;
  isVerified?: boolean;
  role: string;
  isFollowing?:boolean,
  followingCount?:number,
 
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
    serviceModes:ServiceModes[],
    homeservicecount: number;
    verificationStatus: string;
  };
}


export interface IAddSearchHistoryInput{
  userId:string,
  beauticianId:string
}

export interface IRemoveSearchHistoryInput{
  userId:string,
  searchHistoryId:string
}


export interface IProfileImageChangeInput{
  profileImg:Express.Multer.File
}

export interface IProfileImageChangeOutput{
  profileImg?:string
}

export interface IRecentSearchResponse{
   searchHistoryId:string,
  beauticianId:string,
    userName: string;
  fullName: string;
  profileImg: string;
}
export interface IRecentSearchOutput{
 success:boolean,
 message:string,
 data:IRecentSearchResponse[]
}