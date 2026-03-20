import { IGetMessagesByChatInput, IGetMessagesByChatOutput } from "../../interfaceType/chatType";

export interface IGetMessagesByChatUseCase{
  execute(input:IGetMessagesByChatInput):Promise<IGetMessagesByChatOutput>
}