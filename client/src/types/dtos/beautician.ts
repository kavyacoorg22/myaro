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

export interface IGetServiceAreaDto {
  homeServiceableLocation?: string[];
  serviceableLocation?: string[];
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
   updatedAt:Date
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