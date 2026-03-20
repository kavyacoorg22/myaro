import { Chat } from "../../../domain/entities/chat";
import { ICreateChatInput } from "../../interfaceType/chatType";

export interface ICreateChatUSeCase {
  execute(input:ICreateChatInput):Promise<Chat>
}