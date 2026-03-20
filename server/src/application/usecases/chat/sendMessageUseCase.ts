import { MessageType } from "../../../domain/enum/messageEnum";
import { AppError } from "../../../domain/errors/appError";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { ISendMessageUSeCase } from "../../interface/chat/ISendMesageUseCase";
import { ISendMessageInput } from "../../interfaceType/chatType";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";

export class SendMessageUseCase implements ISendMessageUSeCase {
  constructor(
    private messageRepo: IMessageRepository,
    private chatRepo: IChatRepository,
    private socketEmitter: ISocketEmitter,
  ) {}
  async execute(input: ISendMessageInput): Promise<void> {
    const { chatId, senderId, receiverId, message, bookingId } = input;
    const type = input.type ?? MessageType.TEXT;
    const chat = await this.chatRepo.findById(chatId);
    if (!chat)
      throw new AppError(`Chat ${chatId} not found.`, HttpStatus.NOT_FOUND);

    if (!chat.participants.includes(senderId)) {
      throw new AppError(`Access denied.`, HttpStatus.FORBIDDEN);
    }

    const saved = await this.messageRepo.create({
      chatId,
      senderId,
      receiverId,
      message,
      type,
      bookingId,
      seen: false
    });

    await this.chatRepo.updateLastMessage(chatId, message, saved.createdAt);

   this.socketEmitter.emitToRoom(chatId, SOCKET_EVENTS.NEW_MESSAGE, saved);

   this.socketEmitter.emitToRoom(`user:${receiverId}`, SOCKET_EVENTS.NEW_NOTIFICATION, {
  chatId,
  lastMessage:   message,
  lastMessageAt: saved.createdAt,
});
  }
}
