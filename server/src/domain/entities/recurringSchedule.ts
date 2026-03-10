import { ScheduleEndType, ScheduleType } from "../enum/beauticianEnum"

export interface RecurringSchedule {
  id:string
  beauticianId: string
  rrule: string
  timeFrom: string
  timeTo: string
  type: ScheduleType
  startDate: Date
  endType: ScheduleEndType
  endDate?: Date
  endCount?: number
}