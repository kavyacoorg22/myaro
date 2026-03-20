import { IGetChatByParticipantsInput } from "../../../../application/interfaceType/chatType";
import { Chat } from "../../../entities/chat";


export interface IChatRepository {
create(data:Omit<Chat, "id" | "createdAt" | "updatedAt">):Promise<Chat>
findById(id:string):Promise<Chat|null>
getChatByParticipants(input:IGetChatByParticipantsInput):Promise<Chat|null>
updateLastMessage(chatId:string,message:string,at:Date):Promise<void>
findByUserId(userId:string,limit:number,cursor?:string):Promise<Chat[]>
}