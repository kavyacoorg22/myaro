import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { IUserOnlineStatusUSeCase } from "../../interface/chat/IUserOnlineStatusUseCase";
import { IUserPresenceInput } from "../../interfaceType/chatType";
import { SOCKET_EVENTS } from "../../events/socketEvents";

export class UserOnlineStatusUseCase implements IUserOnlineStatusUSeCase {
  constructor(private _socketEmitter: ISocketEmitter) {}

  async userOnline({
    socketId,
    userId,
    chatId,
  }: IUserPresenceInput): Promise<void> {
    this._socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.USER_ONLINE,
      { userId, chatId },
    );
        this._socketEmitter.emitToRoomExcept(
      socketId,
      `user:${userId}`,
      SOCKET_EVENTS.USER_ONLINE,
      { userId },
    );
  }


async userOffline({ socketId, userId, chatId }: IUserPresenceInput): Promise<void> {
  if (chatId) {
    this._socketEmitter.emitToRoomExcept(socketId, chatId, SOCKET_EVENTS.USER_OFFLINE, { userId });
  }
  this._socketEmitter.emitToRoom(`user:${userId}`, SOCKET_EVENTS.USER_OFFLINE, { userId });
}
}
