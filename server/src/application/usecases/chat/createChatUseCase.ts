import { Chat } from "../../../domain/entities/chat";
import { AppError } from "../../../domain/errors/appError";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { chatMessages } from "../../../shared/constant/message/chatMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { ICreateChatUSeCase } from "../../interface/chat/ICreateChatUSeCase";
import { ICreateChatInput } from "../../interfaceType/chatType";

export class CreateChatUseCase implements ICreateChatUSeCase {
  constructor(private _chatRepo: IChatRepository) {}
  async execute(input: ICreateChatInput): Promise<Chat> {
    const { participantA, participantB } = input;
  if (participantA === participantB) {
      throw new AppError(chatMessages.ERROR.SELF_CHAT_NOT_ALLOWED,HttpStatus.FORBIDDEN);
    }

    const existing = await this._chatRepo.getChatByParticipants({
      participantA,
      participantB,
    });
    if (existing) return existing;

    return this._chatRepo.create({
      participants: [participantA, participantB],
      lastMessage: "",
      lastMessageAt: new Date(),
    });
  }
}
