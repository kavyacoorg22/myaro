import { MessageType } from "../enum/messageEnum";

export interface Message
{
  id: string,
  chatId: string,
  senderId: string,
  receiverId: string,
  message: string,
  type:MessageType,
  bookingId?: string,
  seen: boolean,
  seenAt:Date,
  createdAt: Date,
  updatedAt: Date
}