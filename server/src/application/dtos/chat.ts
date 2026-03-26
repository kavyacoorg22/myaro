import { ServiceModes } from "../../domain/enum/beauticianEnum";
import { MessageType } from "../../domain/enum/messageEnum";
import { UserRole } from "../../domain/enum/userEnum";

export interface IChatListDto{
  chatId:        string;
  lastMessage:   string;
  lastMessageAt: Date;
  unreadCount:   number;
  participant: {
    id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
      role:UserRole,
    serviceModes?:ServiceModes[]
  };
}

export interface IGetMessageByChat{
    id: string,
  chatId: string,
  senderId: string,
  receiverId: string,
  message: string,
  type:MessageType,
  bookingId?: string,
  seen: boolean,
  seenAt:string,
 createdAt:string,
 user:{
   id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
    
 }
}