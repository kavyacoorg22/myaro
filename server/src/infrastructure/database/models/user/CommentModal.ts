import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { CommentType } from "../../../../domain/enum/userEnum";

export type CommentDoc=Document &{
  _id:Types.ObjectId,
  userId:Types.ObjectId,
  postId?:Types.ObjectId,
  beauticianId?:Types.ObjectId,
  parentId?:Types.ObjectId|null,
    replyCount?:number,
  text:string,
  type:CommentType,
  isDeleted:boolean,
  createdAt:Date,
  updatedAt:Date
}

const CommentSchema=new Schema<CommentDoc>({
   userId:{type:Schema.Types.ObjectId,required:true},
   postId:{type:Schema.Types.ObjectId},
   beauticianId:{type:Schema.Types.ObjectId},
   parentId:{type:Schema.Types.ObjectId},
   text:{type:String,required:true},
   type:{type:String,enum:Object.values(CommentType)},
   isDeleted:{type:Boolean,default:false},
   replyCount:{type:Number}
},{timestamps:true})

CommentSchema.index({ postId: 1, parentId: 1 });
CommentSchema.index({ parentId: 1 });

export const CommentModal:Model<CommentDoc>=mongoose.models.Comment||mongoose.model<CommentDoc>('Comment',CommentSchema)