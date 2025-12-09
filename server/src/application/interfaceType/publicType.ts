import { UserRole } from "../../domain/enum/userEnum";


export interface IOwnProfileOutput{
  userId: string;
  userName: string;
  fullName?: string;
  profileImg?: string;
  isVerified?: boolean;
  role: string;
  
  
 
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