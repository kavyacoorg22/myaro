import { ShopAddressVO } from "../../domain/entities/Beautician";
import { LocationVO } from "../../domain/entities/beauticianServiceAres";
import { ServiceModes, VerificationStatus } from "../../domain/enum/beauticianEnum";
import { PostType, UserRole } from "../../domain/enum/userEnum";
import { BeauticianDashboardDto, IGetAllPostsDto, IGetBeauticianPostsDto, IGetServiceAreaDto } from "../dtos/beautician";
import { IMediaInput } from "./mediaType";

export interface BeauticianFiles {
  portfolioImage: Express.Multer.File[];
  certificateImage?: Express.Multer.File[];
  shopPhotos?: Express.Multer.File[];
  shopLicence?: Express.Multer.File[];
}

export interface IBeauticianRegistrationInput {
  userId: string;
  yearsOfExperience: number;
  about: string;
  hasShop: boolean;
  shopName?: string;
  shopAddress?: ShopAddressVO;
  files: BeauticianFiles;
  serviceModes:ServiceModes[]
}

export interface IBeauticianRegistartionOutput {
  verificationStatus: VerificationStatus;
  beauticianId: string;
}

export interface IBeauticianStatusOutPut {
  verificationStatus: VerificationStatus;
}

export interface IBeauticianPaymentDeatilInput {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export interface IBeauticianPaymentDeatilOutput {
  userId: string;
  isVerified: boolean;
  role: UserRole;
}

export interface IBeauticianEditProfileInput {
  userName: string;
  fullName: string;
  about: string;
  shopName?: string;
  shopAddress: Partial<ShopAddressVO>;
  yearsOfExperience: number;
  serviceModes:ServiceModes[],
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export interface IBeauticianViewEditProfileOutput {
  profileImg?: string;
  userName: string;
  fullName: string;
  yearsOfExperience: number;
  shopName?: string;
  about: string;
  shopAddress?: Partial<ShopAddressVO>;
  serviceModes:ServiceModes[],
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export interface location{
   city: string;
  lat: number|null;
  lng: number|null;
  formattedString: string;
}
export interface IAddServiceAreaRequest {
  homeServiceableLocation?: location[];
  serviceableLocation?: location[];
}

export interface IGetServiceAreaResponse {
  locations: IGetServiceAreaDto;
}


export interface ICreatePostInput{
 description?:string,
 postType:PostType,
 location?:LocationVO,
 media:IMediaInput[],
}

export interface IGetAllHomeFeedOutput{
  posts:IGetAllPostsDto[],
  nextCursor:string|null
}

export interface IGetTipsAndRentOutput{
 posts:IGetAllPostsDto[]
 nextCursorTips:string|null,
 nextCursorRent :string|null
}


export interface IGetBeauticianPostOutPut{
  posts:IGetBeauticianPostsDto[],
  nextCursor:string|null
}

export interface IGetPostSearchResult{
  posts:IGetAllPostsDto[]
   nextCursor: string | null
}

export interface IGetBeauticianDashboardOutPut{
  data:BeauticianDashboardDto
          
}