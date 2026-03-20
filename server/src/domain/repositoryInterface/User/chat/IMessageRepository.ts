import { Message } from "../../../entities/message";

export interface IMessageRepository{
  create(data:Omit<Message,'id'|'createdAt'|'updatedAt'|'seenAt'>):Promise<Message>
  findByChatId(id:string, limit :number, cursor?: string):Promise<Message[]>
  markSeen(chatId: string, receiverId: string): Promise<void>;
  getUnreadCount(chatId: string, userId: string): Promise<number>;

}