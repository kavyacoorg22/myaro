import { Types } from "mongoose";
import { Chat } from "../../../domain/entities/chat";
import { Message } from "../../../domain/entities/message";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { MessageDoc, MessageModel } from "../../database/models/user/messageModal";
import { GenericRepository } from "../genericRepository";


export class MessageRepository extends GenericRepository<Message,MessageDoc> implements IMessageRepository{
    constructor()
    {
      super(MessageModel)
    }

    async create(data: Omit<Message, "id" | "createdAt" | "updatedAt"|'seenAt'>): Promise<Message> {
      const doc=await MessageModel.create(data)
      return this.map(doc)
    }

   async findByChatId(chatId: string, limit = 31, cursor?: string): Promise<Message[]> {
  const query: any = { chatId: new Types.ObjectId(chatId)};

  if (cursor) {
    query._id = { $lt: new Types.ObjectId(cursor) };
  }
  const docs = await MessageModel
    .find(query)
    .sort({ createdAt: -1 })  
    .limit(limit)

  return docs.reverse().map((doc) => this.map(doc));
}

async markSeen(chatId: string, receiverId: string): Promise<void> {
  await MessageModel.updateMany(
    {
      chatId:     new Types.ObjectId(chatId),
      receiverId: new Types.ObjectId(receiverId),
      seen:       false,
    },
    {
      $set: { seen: true, seenAt: new Date() },
    }
  );
}

async getUnreadCount(chatId: string, userId: string): Promise<number> {
  return await MessageModel.countDocuments({
    chatId:     new Types.ObjectId(chatId),
    receiverId: new Types.ObjectId(userId),
    seen:       false,
  });
}
    protected map(doc:MessageDoc):Message{
      const base=super.map(doc)
      return{
        id:base.id.toString(),
        chatId:doc.chatId.toString(),
        senderId:doc.senderId.toString(),
        receiverId:doc.receiverId.toString(),
        message:doc.message,
        type:doc.type,
        bookingId:doc.bookingId?.toString(),
        seen:doc.seen,
        seenAt:doc.seenAt,
        createdAt:doc.createdAt,
        updatedAt:doc.updatedAt
      }
    }
}