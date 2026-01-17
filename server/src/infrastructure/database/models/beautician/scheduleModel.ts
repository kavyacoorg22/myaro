import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ScheduleDoc=Document & {
  _id:Types.ObjectId,
  beauticianId:Types.ObjectId,
  slot:{
    startTime:string,
    endTime:String,
  },
  date:Date,
  createdAt:Date,
  updatedAt:Date,
}

const slotSchema=new Schema({
  startTime:{type:String},
  endTime:{type:String}
})

export const ScheduleSchema=new Schema<ScheduleDoc>({
  beauticianId:{type:Schema.Types.ObjectId},
  slot:{type:slotSchema},
  date:{type:Date},
},{timestamps:true})

export const ScheduleModel:Model<ScheduleDoc>=mongoose.models.Schedule||mongoose.model('Schedule',ScheduleSchema)