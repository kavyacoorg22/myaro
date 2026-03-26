import type { MessageTypes } from "../../constants/types/chat";
import type { IChatListDto, MessageDto } from "../dtos/chat";
import type { BackendResponse } from "./api";

export interface IJoinChatRoomRequest {
  socketId: string;
  chatId: string;
  userId: string;
}

export interface IGetChatByParticipantsRequest {
  participantA: string;
  participantB: string;
}

export interface ICreateChatRequest {
  participantA: string;
  participantB: string;
}

export interface IGetMessagesByChatRequest {
  chatId: string;
  userId: string;
  limit?: number;
  cursor?: string;
}

export interface IGetMessagesByChatResponseData{
  messages: MessageDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ISendMessageRequest {
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  type?: MessageTypes;
  bookingId?: string;
}

export interface ITypingRequest {
  socketId: string;
  chatId: string;
  userId: string;
}

export interface IUserPresenceRequest {
  socketId: string;
  userId: string;
  chatId: string;
}

export interface IMarkSeenRequest {
  chatId: string;
  receiverId: string;
  senderId: string;
}

export interface IGetUserChatsResponseData {
  chats: IChatListDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IGetUserChatsRequest {
  userId:  string;
  limit?:  number;
  cursor?: string; 
}

export interface IChatResponseData {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;

}

export type IGetUserChatsResponse=BackendResponse<IGetUserChatsResponseData>
export type IGetMessagesByChatResponse=BackendResponse<IGetMessagesByChatResponseData>
export type IChatResponse=BackendResponse<IChatResponseData>