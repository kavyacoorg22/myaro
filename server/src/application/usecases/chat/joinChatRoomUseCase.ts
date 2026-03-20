import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IJoinChatRoomUseCase } from "../../interface/chat/IjoinChatRoomUseCase";
import { IJoinChatRoomInput } from "../../interfaceType/chatType";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";

export class JoinChatRoomRoomUseCase implements IJoinChatRoomUseCase {
  constructor(
    private chatRepo: IChatRepository,
    private socketEmitter: ISocketEmitter,
  ) {}
  async execute(input: IJoinChatRoomInput): Promise<void> {
    const { chatId, userId, socketId } = input;
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) throw new Error(`Chat ${chatId} not found.`);

    if (!chat.participants.includes(userId)) {
      throw new Error(`Access denied.`);
    }

    this.socketEmitter.joinRoom(socketId, chatId);

    this.socketEmitter.emitToRoomExcept(
      socketId,
      chatId,
      SOCKET_EVENTS.USER_JOINED_CHAT,
      {
        chatId,
        userId,
      },
    );
  }
}
