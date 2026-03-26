import type { ServiceModesType } from "../../constants/types/beautician";
import type { BookingStatusType } from "../../constants/types/booking";
import type { MessageTypes } from "../../constants/types/chat";
import type { Role } from "./user";

export interface ChatDto {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;

}



export interface MessageDto
{
  id: string,
  chatId: string,
  senderId: string,
  receiverId: string,
  message: string,
  type:MessageTypes,
  bookingId?: string,
  status:BookingStatusType,
  seen: boolean,
  seenAt:string,
 createdAt:string
}


export interface IChatListDto{
  chatId:        string;
  lastMessage:   string;
  lastMessageAt: string;
  unreadCount:   number;
  participant: {
    id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
    role:Role,
    serviceModes?:ServiceModesType[]
  };
}