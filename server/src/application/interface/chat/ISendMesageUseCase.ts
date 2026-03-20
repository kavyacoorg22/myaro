import { ISendMessageInput } from "../../interfaceType/chatType";

export interface ISendMessageUSeCase
{
  execute(input:ISendMessageInput):Promise<void>
}