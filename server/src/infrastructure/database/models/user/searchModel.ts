import mongoose, { Document, Model, Schema, Types } from "mongoose";




export type SearchHistoryDoc=Document &{
  _id:Types.ObjectId
  userId:Types.ObjectId,
  beauticianId:Types.ObjectId,
  isDeleted:boolean,
  createdAt:Date,
  updatedAt:Date
}

const SearchHistorySchema=new Schema<SearchHistoryDoc>(
  {
    userId:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    beauticianId:{ type: Schema.Types.ObjectId, ref: "Beautician", required: true },
    isDeleted:{type:Boolean,required:true,default:false},
  },{timestamps:true}
)


export const SearchHistoryModel:Model<SearchHistoryDoc>=mongoose.models.SearchHistory || mongoose.model<SearchHistoryDoc>("SearchHistory",SearchHistorySchema)