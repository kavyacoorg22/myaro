import { ITypingInput } from "../../interfaceType/chatType";

export interface ITypingIndicatorUseCase
{
  startTyping(input:ITypingInput):Promise<void>
  stopTyping(input:ITypingInput):Promise<void>
}