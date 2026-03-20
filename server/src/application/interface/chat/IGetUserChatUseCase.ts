import { IGetUserChatsInput, IGetUserChatsOutput } from "../../interfaceType/chatType";

export interface IGetUserChatsUseCase{
  execute(input:IGetUserChatsInput):Promise<IGetUserChatsOutput>
}