import { Message } from "../../domain/entities/message";
import { MessageType } from "../../domain/enum/messageEnum";
import { BookingStatus } from "../../domain/enum/bookingEnum";
import { IChatRepository } from "../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../domain/repositoryInterface/User/chat/IMessageRepository";
import { SOCKET_EVENTS } from "../events/socketEvents";
import { ISocketEmitter } from "../serviceInterface/ISocketEmitter";
 
export class ChatMessageService {
  constructor(
    private messageRepo:   IMessageRepository,
    private chatRepo:      IChatRepository,
    private socketEmitter: ISocketEmitter,
  ) {}
 
  async sendAndEmit(input: {
    chatId:      string;
    senderId:    string;
    receiverId:  string;
    message:     string;
    type:        MessageType;
    bookingId?:  string;
    status?:     BookingStatus;
  }): Promise<Message> {
    const saved = await this.messageRepo.create({
      ...input,
      seen:  false,
    });
 
    await this.chatRepo.updateLastMessage(
      input.chatId,
      saved.message,
      saved.createdAt,
    );
 
    // Emit to chat room
    this.socketEmitter.emitToRoom(
      input.chatId,
      SOCKET_EVENTS.NEW_MESSAGE,
      saved,
    );
 
    // Emit notification to receiver's user room
    this.socketEmitter.emitToRoom(
      `user:${input.receiverId}`,
      SOCKET_EVENTS.NEW_NOTIFICATION,
      {
        chatId:        input.chatId,
        lastMessage:   saved.message,
        lastMessageAt: saved.createdAt,
      },
    );
 
    return saved;
  }
}
 