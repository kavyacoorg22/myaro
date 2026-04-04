import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LikeDoc=Document &{
  _id:Types.ObjectId,
  userId:Types.ObjectId,
  postId:Types.ObjectId,
  createdAt:Date,
  updatedAt:Date
}

const LikeSchema=new Schema<LikeDoc>({
   userId:{type:Schema.Types.ObjectId,required:true},
   postId:{type:Schema.Types.ObjectId,required:true},
},{timestamps:true})

export const likeModal:Model<LikeDoc>=mongoose.models.Like||mongoose.model<LikeDoc>('Like',LikeSchema)