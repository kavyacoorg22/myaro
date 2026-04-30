import type { scheduleSourceType, ScheduleTypeValue } from "../../constants/types/beautician";
import type { LocationVO } from "../../features/shared/locationTagInput";
import type { PostType } from "../../features/types/mediaType";
import type { Slot } from "../api/beautician";

export interface Service {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export interface IGetAvailabilitySlotDto {
  scheduleId:string,
  slots: Slot[];
  date: Date;
  source:     scheduleSourceType;
    type?:      ScheduleTypeValue;
}
export interface IServiceLocation {
  city: string;
  lat: number;
  lng: number;
  formattedString: string;
}

export interface IGetServiceAreaDto {
   homeServiceableLocation?: IServiceLocation[];
  serviceableLocation?: IServiceLocation[];
}



export interface IGetBeauticianPostsDto{
  id:string,
   description?:string,
   postType:PostType,
   location?:LocationVO,
   media:string[],
   likesCount?:number,
   commentsCount?:number,
   createdAt:Date,
   updatedAt:Date,
   isLiked:boolean
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
   timeAgo:string
}

export interface IGetmonthlyAvailabilityDto{
  date:Date,
  type:ScheduleTypeValue
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

export interface IBeauticianReRegistrationPrefillDto {
  yearsOfExperience: number;
  about: string;
  hasShop: boolean;
  shopName?: string;
  shopAddress?: {
    address: string;
    city: string;
  };
  serviceModes: string[];
  rejectionReason: string;

  existingPortfolioImages: string[];
  existingCertificateImages: string[];
  existingShopPhotos: string[];
  existingShopLicences: string[];
}