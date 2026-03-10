import { Types } from "mongoose";
import { RecurringSchedule } from "../../../domain/entities/recurringSchedule";
import { IReccuringScheduleRepository } from "../../../domain/repositoryInterface/beautician/IRecurringScheduleRepository";
import { RecurringScheduleDoc, RecurringScheduleModel } from "../../database/models/beautician/recurringScheduleModal";
import { GenericRepository } from "../genericRepository";


export class RecurringRepository extends GenericRepository<RecurringSchedule,RecurringScheduleDoc> implements IReccuringScheduleRepository{
  constructor()
  {
    super(RecurringScheduleModel)
  }

  async create(data: Omit<RecurringSchedule, "id" | "createdAt" | "updatedAt">): Promise<RecurringSchedule> {
    const doc=await RecurringScheduleModel.create(data)
    return this.map(doc)
  }

  async findByBeauticianId(beauticianId: string): Promise<RecurringSchedule[]> {
    const docs=await RecurringScheduleModel.find({beauticianId:new Types.ObjectId(beauticianId)})
    return docs.map((doc)=>this.map(doc))
  }

  async deleteById(id: string): Promise<boolean> {
    const docs=await RecurringScheduleModel.findByIdAndDelete(id)
    return !!docs
  }

  async findById(id: string): Promise<RecurringSchedule | null> {
    const doc=await RecurringScheduleModel.findById(id)
    return doc?this.map(doc):null
  }
  protected map(doc:RecurringScheduleDoc):RecurringSchedule{
    const base=super.map(doc)
    return{
      id:base.id.toString(),
      beauticianId:doc.beauticianId.toString(),
      rrule:doc.rrule,
      timeFrom:doc.timeFrom,
      timeTo:doc.timeTo,
      type:doc.type,
      startDate:doc.startDate,
      endType:doc.endType,
      endDate:doc.endDate,
      endCount:doc.endCount
    }
  }
}