import { ScheduleStatus } from "../enum/beauticianEnum";

export interface Slot{
 startTime:string,
 endTime:string
}

export interface Schedule{
  id:string,
  beauticianId:string,
  status:ScheduleStatus
  slot:Slot,
  date:Date,
  createdAt:Date,
  updatedAt:Date
}