import { Chat } from "../../../domain/entities/chat";
import { AppError } from "../../../domain/errors/appError";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { chatMessages } from "../../../shared/constant/message/chatMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IGetChatByParticipants } from "../../interface/chat/IGetChatByParticipants";
import { IGetChatByParticipantsInput } from "../../interfaceType/chatType";

export class GetChatByParticipants implements IGetChatByParticipants {
  constructor(private _chatRepo: IChatRepository) {}
  async execute(input: IGetChatByParticipantsInput): Promise<Chat | null> {
    const { participantA, participantB } = input;

    if (participantA === participantB) {
      throw new AppError(
        chatMessages.ERROR.SELF_CHAT_NOT_ALLOWED,
        HttpStatus.FORBIDDEN,
      );
    }

    return this._chatRepo.getChatByParticipants({ participantA, participantB });
  }
}
