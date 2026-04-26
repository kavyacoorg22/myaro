import { ShopAddressVO } from "../../domain/entities/Beautician";
import { LocationVO } from "../../domain/entities/beauticianServiceAres";
import { Slot } from "../../domain/entities/schedule";
import { scheduleSourceType, ScheduleType, ServiceModes, VerificationStatus } from "../../domain/enum/beauticianEnum";
import { PostType, UserRole } from "../../domain/enum/userEnum";
import { location } from "../interfaceType/beauticianType";

export interface IVerificationStatusDto {
  verificationStatus: VerificationStatus;
  rejectionReason?:string
}

export interface IBeauticianDTO {
  userId: string;
  profileImg?: string;
  userName: string;
  verificationStatus: VerificationStatus;
  yearsOfExperience: number;
  shopName?: string;
  city?: string;
}

export interface IBeauticianProfileDTO {
  userId: string;
  profileImg: string;
  userName: string;
  yearsOfExperience: number;
  shopName?: string;
  city?: string;
  about: string;
  shopAddress?: ShopAddressVO;
  portfolioImage: string[];
  shopPhotos: string[];
  certificateImage: string[];
  hasShop: boolean;
}

export interface IBankDetailsDTO {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export interface IBeauticianViewEditProfileDTO {
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

export interface IUpdateRegistrationDTO {
  userId: string;
  isVerified: boolean;
  role: UserRole;
}

export interface ISearchBeauticianResultDto {
  beauticianId: string;
  userName: string;
  fullName: string;
  profileImg: string;
}

export interface IGetAvailabilitySlotDto {
  scheduleId:string,
  slots: Slot[];
  date: Date;
  source:scheduleSourceType
  type:ScheduleType
}

export interface IGetmonthlyAvailabilityDto{
  date:Date,
  type:ScheduleType
}
export interface IGetServiceAreaDto {
  homeServiceableLocation?: location[];
  serviceableLocation?: location[];
}


export interface IGetBeauticianPostsDto{
  id:string,
   description?:string,
   postType:PostType,
   location?:LocationVO,
   media:string[],
   likesCount?:number,
   commentsCount?:number,
   timeAgo:string,
   isLiked:boolean,
}

export interface IGetAllPostsDto{
   id:string,
   beauticianId:string,
   userName:string,
   fullName:string,
   profileImg:string,
   description?:string,
   postType:PostType,
   location?:LocationVO,
   media:string[],
   likesCount?:number,
   commentsCount?:number,
  timeAgo:string,
  isLiked: boolean
}


export interface DashboardStatsDto {
  todayBookingsCount:   number;
  completedToday:       number;
  upcomingToday:        number;
  pendingRequestsCount: number;
  todayEarnings:        number;
  monthlyEarnings:      number;
}

export interface EarningsSummaryDto {
  totalEarnings:      number;
  withdrawableAmount: number;
  pendingAmount:      number;
  joinedSince:        string;
}

export interface ChartPointDto {
  label:    string;
  earnings: number;
}

export interface RecentPayoutDto {
  payoutId:  string;
  amount:    number;
  status:    string;
  createdAt: string;
}

export interface BeauticianDashboardDto {
  stats:         DashboardStatsDto;
  earnings:      EarningsSummaryDto;
  weeklyChart:   ChartPointDto[];
  monthlyChart:  ChartPointDto[];
  recentPayouts: RecentPayoutDto[];
  avgRating:     number;   
  totalReviews:  number;
}