import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { ISocketEmitter } from "../../serviceInterface/ISocketEmitter";
import { SOCKET_EVENTS } from "../../events/socketEvents";
import { IMarkSeenInput } from "../../interfaceType/chatType";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { chatMessages } from "../../../shared/constant/message/chatMessage";
import { generalMessages } from "../../../shared/constant/message/generalMessage";

export class MarkSeenUseCase {
  constructor(
    private _chatRepo: IChatRepository,
    private _messageRepo: IMessageRepository,
    private _socketEmitter: ISocketEmitter,
  ) {}

  async execute({
    chatId,
    receiverId,
    senderId,
  }: IMarkSeenInput): Promise<void> {
    const chat = await this._chatRepo.findById(chatId);
    if (!chat)
      throw new AppError(
        chatMessages.ERROR.NOT_FOUND_WITH_ID(chatId),
        HttpStatus.NOT_FOUND,
      );

    if (!chat.participants.some((p) => p.toString() === receiverId)) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    await this._messageRepo.markSeen(chatId, receiverId);

    this._socketEmitter.emitToRoom(
      `user:${senderId}`,
      SOCKET_EVENTS.MESSAGE_SEEN,
      { chatId, seenBy: receiverId, seenAt: new Date() },
    );
  }
}
