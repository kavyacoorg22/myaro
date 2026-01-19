import { Types } from "mongoose";
import { Schedule } from "../../../domain/entities/schedule";
import { IScheduleRepository } from "../../../domain/repositoryInterface/IScheduleRepository";
import { ScheduleDoc, ScheduleModel } from "../../database/models/beautician/scheduleModel";
import { GenericRepository } from "../genericRepository";


export class ScheduleRepository extends GenericRepository<Schedule,ScheduleDoc> implements IScheduleRepository{
  constructor()
  {
    super(ScheduleModel)
  }

async create(data: Omit<Schedule, "id" | "createdAt" | "updatedAt">): Promise<Schedule> {
  const doc=await ScheduleModel.create(data)
  return this.map(doc)
}

async updateById(id: string, data: Partial<Omit<Schedule, "id">>): Promise<Schedule|null> {
  const doc=await ScheduleModel.findByIdAndUpdate(
    id,
    {$set:data},
    {new:true}
  )
  return doc?this.map(doc):null
}

async findByBeauticianAndDate(id: string, date: Date): Promise<Schedule | null> {
    const normalizedDate = this.normalizeDate(date);

  const doc=await ScheduleModel.findOne(
    {beauticianId:new Types.ObjectId(id),date: normalizedDate}
  )
  return doc?this.map(doc):null
}

async findByBeauticianId(beauticianId: string): Promise<Schedule | null> {
  const doc=await ScheduleModel.findById({beauticianId:new Types.ObjectId(beauticianId)})
  return doc?this.map(doc):null
}
  protected map(doc:ScheduleDoc):Schedule{
    const base=super.map(doc) as any
    return{
      id:base.id,
      beauticianId:doc.beauticianId.toString(),
      slots:doc.slots.map((slot)=>({
        startTime:slot.startTime,
        endTime:slot.endTime
      })),
      date:doc.date,
      createdAt:doc.createdAt,
      updatedAt:doc.updatedAt
    }
  }

  private normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

}