import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ChatDoc=Document&{
  _id:Types.ObjectId,
  participants:Types.ObjectId [],
  lastMessage: string,
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}


const ChatSchema=new Schema<ChatDoc>(
  {
    participants:[{type:Schema.Types.ObjectId}],
    lastMessage:{type:String},
    lastMessageAt:{type:Date},

  },{timestamps:true}
)
ChatSchema.index({
  participants: 1,
  lastMessageAt: -1
})
export const ChatModel:Model<ChatDoc>=mongoose.models.Chat || mongoose.model<ChatDoc>('Chat',ChatSchema)