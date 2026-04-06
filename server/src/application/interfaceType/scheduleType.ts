import { Slot } from "../../domain/entities/schedule";
import { ScheduleEndType, scheduleSourceType, ScheduleType } from "../../domain/enum/beauticianEnum";
import { IGetAvailabilitySlotDto, IGetmonthlyAvailabilityDto } from "../dtos/beautician";

export interface IAddAvailabilityRequest {
  dates: string[];
  slots: Slot[];
  type:ScheduleType
}

export interface IGetAvailabilitySlotResponse{
  availability:IGetAvailabilitySlotDto
}

export interface IAddRecursionScheduleInput{
   rrule: string
    timeFrom: string
    timeTo: string
    type: ScheduleType
    startDate: Date
    endType: ScheduleEndType
    endDate?: Date
    endCount?: number
}


export interface IDeleteRecursionScheduleInput{
   recurringId: string 
    date: Date
  
}

export interface IGetmonthlyAvailabilityOutput{
  dates:IGetmonthlyAvailabilityDto[]
}


export interface IBlockBookedSlotInput {
  beauticianId: string;
  date: Date;
  startTime: string;  
  endTime: string;    
}