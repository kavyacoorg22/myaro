import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ScheduleEndType, ScheduleType } from "../../../../domain/enum/beauticianEnum";


export type RecurringScheduleDoc=Document&{
  _id:Types.ObjectId,
    beauticianId: Types.ObjectId
    rrule: string
    timeFrom: string
    timeTo: string
    type: ScheduleType
    startDate: Date
    endType: ScheduleEndType
    endDate?: Date
    endCount?: number
}

export const RecurringScheduleSchema=new Schema<RecurringScheduleDoc>({
beauticianId:{type:Schema.Types.ObjectId,required:true},
rrule:{type:String,required:true},
timeFrom:{type:String},
timeTo:{type:String},
type:{type:String,enum:Object.values(ScheduleType),default:ScheduleType.AVAILABILITY,required:true},
startDate:{type:Date,required:true},
endType:{type:String,enum:Object.values(ScheduleEndType),required:true},
endDate:{type:Date},
endCount:{type:Date}
},{timestamps:true})
RecurringScheduleSchema.index({ beauticianId: 1 })

export const RecurringScheduleModel:Model<RecurringScheduleDoc>=mongoose.models.RecurringSchedule||mongoose.model('RecurringSchedule',RecurringScheduleSchema)
