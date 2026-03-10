import { RecurringSchedule } from "../../entities/recurringSchedule";


export interface IReccuringScheduleRepository{
     create(data:Omit<RecurringSchedule,'id'|'createdAt'|'updatedAt'>):Promise<RecurringSchedule>
     findByBeauticianId(beauticianId:string):Promise<RecurringSchedule[]|null>
     deleteById(id:string):Promise<boolean>
     findById(id:string):Promise<RecurringSchedule|null>
}