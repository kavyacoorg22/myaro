import { Chat } from "../../domain/entities/chat";
import { User } from "../../domain/entities/User";
import { IChatListDto } from "../dtos/chat";

export function toGetUserChats(chat:Chat,user:User,unreadCount:number):IChatListDto{
return{
  chatId:        chat.id,
    lastMessage:   chat.lastMessage,
    lastMessageAt: chat.lastMessageAt,
      unreadCount, 
    participant: {
      id:         user.id,
      fullName:   user.fullName,
      userName:   user.userName,
      profileImg: user.profileImg,
    },
}
}