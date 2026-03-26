
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { IChatRepository }    from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { ISocketEmitter }     from "../../serviceInterface/ISocketEmitter";
import { SOCKET_EVENTS }      from "../../events/socketEvents";
import { IMarkSeenInput } from "../../interfaceType/chatType";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";


export class MarkSeenUseCase {
  constructor(
    private chatRepo:    IChatRepository,
    private messageRepo: IMessageRepository,
    private socketEmitter: ISocketEmitter,
  ) {}

  async execute({ chatId, receiverId, senderId }: IMarkSeenInput): Promise<void> {

  
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) throw new AppError(`Chat ${chatId} not found.`,HttpStatus.NOT_FOUND);

   
   if (!chat.participants.some(p => p.toString() === receiverId)) {
  throw new AppError(`Access denied.`, HttpStatus.FORBIDDEN);
}

    await this.messageRepo.markSeen(chatId, receiverId);

    this.socketEmitter.emitToRoom(
      `user:${senderId}`,
      SOCKET_EVENTS.MESSAGE_SEEN,
      { chatId, seenBy: receiverId, seenAt: new Date() }
    );
  }
}