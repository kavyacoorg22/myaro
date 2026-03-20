import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { IUserOnlineStatusUSeCase } from "../../interface/chat/IUserOnlineStatusUseCase";
import { IUserPresenceInput } from "../../interfaceType/chatType";
import { SOCKET_EVENTS } from "../../events/socketEvents";

export class UserOnlineStatusUseCase implements IUserOnlineStatusUSeCase {
  constructor(private socketEmitter: ISocketEmitter) {}

  async userOnline({
    socketId,
    userId,
    chatId,
  }: IUserPresenceInput): Promise<void> {
    this.socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.USER_ONLINE,
      { userId, chatId },
    );
  }

  async userOffline({
    socketId,
    userId,
    chatId,
  }: IUserPresenceInput): Promise<void> {
    this.socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.USER_OFFLINE,
      { userId, chatId },
    );
  }
}
