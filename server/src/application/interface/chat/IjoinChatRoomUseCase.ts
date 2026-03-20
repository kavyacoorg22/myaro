import { IJoinChatRoomInput } from "../../interfaceType/chatType";


export interface IJoinChatRoomUseCase {
  execute(input:IJoinChatRoomInput):Promise<void>
}