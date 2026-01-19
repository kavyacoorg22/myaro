import { Schedule } from "../entities/schedule";


export interface IScheduleRepository{
   create(data:Omit<Schedule,'id'|'createdAt'|'updatedAt'>):Promise<Schedule>
   updateById(id:string,data:Partial<Omit<Schedule,'id'>>):Promise<Schedule|null>
   findByBeauticianAndDate(id:string,date:Date):Promise<Schedule|null>
   findByBeauticianId(beauticianId:string):Promise<Schedule|null>
} 