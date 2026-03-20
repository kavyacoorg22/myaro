import { Message } from "../../domain/entities/message";
import { MessageType } from "../../domain/enum/messageEnum";
import { IChatListDto } from "../dtos/chat";

export interface IJoinChatRoomInput {
  socketId: string;
  chatId: string;
  userId: string;
}

export interface IGetChatByParticipantsInput {
  participantA: string;
  participantB: string;
}

export interface ICreateChatInput {
  participantA: string;
  participantB: string;
}

export interface IGetMessagesByChatInput {
  chatId: string;
  userId: string;
  limit?: number;
  cursor?: string;
}

export interface IGetMessagesByChatOutput {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ISendMessageInput {
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  type?: MessageType;
  bookingId?: string;
}

export interface ITypingInput {
  socketId: string;
  chatId: string;
  userId: string;
}

export interface IUserPresenceInput {
  socketId: string;
  userId: string;
  chatId: string;
}

export interface IMarkSeenInput {
  chatId: string;
  receiverId: string;
  senderId: string;
}

export interface IGetUserChatsOutput {
  chats: IChatListDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IGetUserChatsInput {
  userId:  string;
  limit?:  number;
  cursor?: string; 
}