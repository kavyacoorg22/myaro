import { ScheduleType } from "../enum/beauticianEnum"

export interface Slot{
 startTime:string,
 endTime:string
}

export interface Schedule{
  id:string,
  beauticianId:string,
  slots:Slot[],
  date:Date,
  type:ScheduleType,
  createdAt:Date,
  updatedAt:Date
}