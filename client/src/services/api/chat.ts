import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import {type IGetUserChatsResponse, type IGetMessagesByChatResponse, type IChatResponse } from "../../types/api/chat"
import type { ChatDto } from "../../types/dtos/chat"
import api, { axiosWrapper } from "../axiosWrapper"


export const ChatApi={
  createChat:async(participantB:string)=>{
    return await axiosWrapper<IChatResponse>(api.post(publicApiRoutes.createChat,
      {participantB}
    ))
  },
  getUserChats:async(cursor:string|null,limit:number)=>{
    const params={
      limit,
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetUserChatsResponse>(api.get(publicApiRoutes.getUserChats,{params}))
  },
  getChatByParticipants:async(participantB:string)=>{
    return await axiosWrapper<ChatDto>(api.get(publicApiRoutes.getChatByparticipants.replace(':id',participantB)))
  },
  getMessagesByChat:async(chatId:string,limit:number,cursor?:string)=>{
    const params={
      limit,
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetMessagesByChatResponse>(api.get(publicApiRoutes.getMessageByChat.replace(':chatId',chatId),{params}))
  }
}