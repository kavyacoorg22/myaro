import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ITypingInput } from "../../interfaceType/chatType";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";

export class TypingIndicatorUseCase {
  constructor(private socketEmitter: ISocketEmitter) {}

  startTyping({ socketId, chatId, userId }: ITypingInput): void {
    this.socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.TYPING_START,
      { chatId, userId },
    );
  }

  stopTyping({ socketId, chatId, userId }: ITypingInput): void {
    this.socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.TYPING_STOP,
      { chatId, userId },
    );
  }
}
