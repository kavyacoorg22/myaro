import { Chat } from "../../../domain/entities/chat";
import { IGetChatByParticipantsInput } from "../../interfaceType/chatType";


export interface IGetChatByParticipants{
  execute(input:IGetChatByParticipantsInput):Promise<Chat|null>
}