import { AppError } from "../../../domain/errors/appError";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IGetMessagesByChatUseCase } from "../../interface/chat/IGetMessagesByChat";
import {
  IGetMessagesByChatInput,
  IGetMessagesByChatOutput,
} from "../../interfaceType/chatType";

export class GetMessagesByChatUseCase implements IGetMessagesByChatUseCase {
  constructor(
    private messageRepo: IMessageRepository,
    private chatRepo: IChatRepository,
  ) {}
  async execute({
    chatId,
    userId,
    limit = 30,
    cursor,
  }: IGetMessagesByChatInput): Promise<IGetMessagesByChatOutput> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat)
      throw new AppError(`Chat ${chatId} not found.`, HttpStatus.NOT_FOUND);

    if (!chat.participants.some((p) => p.toString() === userId)) {
      throw new AppError(`Access denied.`, HttpStatus.FORBIDDEN);
    }
    const messages = await this.messageRepo.findByChatId(
      chatId,
      limit + 1,
      cursor,
    );

    const hasMore = messages.length > limit;

    if (hasMore) messages.pop();

    const nextCursor = hasMore ? messages[0].id : null;

    return { messages, nextCursor, hasMore };
  }
}
