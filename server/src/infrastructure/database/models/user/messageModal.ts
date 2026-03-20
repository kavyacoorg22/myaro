import mongoose, { Document, Model, model, Schema, Types } from "mongoose";
import { MessageType } from "../../../../domain/enum/messageEnum";


export type MessageDoc=Document&{
  _id: Types.ObjectId,
    chatId: Types.ObjectId,
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    message: string,
    type:MessageType,
    bookingId?: Types.ObjectId,
    seen: boolean,
    seenAt:Date,
    createdAt: Date,
    updatedAt: Date
}

const MessageSchema=new Schema<MessageDoc>({
  chatId:{type:Schema.Types.ObjectId,required:true},
  senderId:{type:Schema.Types.ObjectId,required:true},
  receiverId:{type:Schema.Types.ObjectId,required:true},
  message:{type:String,required:true},
  type:{type:String,enum:Object.values(MessageType),default:MessageType.TEXT,required:true},
  bookingId:{type:Schema.Types.ObjectId},
  seen:{type:Boolean,required:true},
  seenAt:{type:Date}
},{timestamps:true})

export const MessageModel:Model<MessageDoc>=mongoose.models.Message || mongoose.model<MessageDoc>('Message',MessageSchema)