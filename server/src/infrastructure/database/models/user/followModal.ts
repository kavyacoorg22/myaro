import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type FollowDoc=Document&{
    _id: Types.ObjectId,
    userId: Types.ObjectId;
    beauticianId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const FollowSchema=new Schema<FollowDoc>({
  userId:{type:Schema.Types.ObjectId},
    beauticianId:{type:Schema.Types.ObjectId},
},{timestamps:true})

export const FollowModel:Model<FollowDoc>=mongoose.models.Follow||mongoose.model<FollowDoc>('Follow',FollowSchema)