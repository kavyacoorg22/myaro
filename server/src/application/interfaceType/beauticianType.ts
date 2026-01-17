import { ShopAddressVO } from "../../domain/entities/Beautician";
import { VerificationStatus } from "../../domain/enum/beauticianEnum";
import { UserRole } from "../../domain/enum/userEnum";

export interface BeauticianFiles {
  portfolioImage: Express.Multer.File[];         
  certificateImage?: Express.Multer.File[];      
  shopPhotos?: Express.Multer.File[];            
  shopLicence?: Express.Multer.File[];           
}

export interface IBeauticianRegistrationInput{
 userId: string;
  yearsOfExperience: number;
  about: string;
  hasShop:boolean;
  shopName?: string;
  shopAddress?:ShopAddressVO;
  files:BeauticianFiles;
}

export interface IBeauticianRegistartionOutput{
 verificationStatus:VerificationStatus,
 beauticianId:string
}


export interface IBeauticianStatusOutPut{
  verificationStatus:VerificationStatus
}

export interface IBeauticianPaymentDeatilInput{
    accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber:string,
  ifscCode: string;
  bankName: string;
  upiId: string;
}


export interface IBeauticianPaymentDeatilOutput{
  userId:string
  isVerified:boolean,
  role:UserRole
}


export interface IBeauticianEditProfileInput{
  userName:string,
  fullName:string;
  about:string,
  shopName?:string,
  shopAddress:Partial<ShopAddressVO>,
  yearsOfExperience:number,
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
}



export interface IBeauticianViewEditProfileOutput{
  profileImg?: string;
  userName: string;
  fullName:string,
  yearsOfExperience: number;
  shopName?: string;
  about: string;
  shopAddress?: Partial<ShopAddressVO>,
   accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
}
