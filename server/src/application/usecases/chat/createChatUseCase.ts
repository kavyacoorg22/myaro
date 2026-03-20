import { Chat } from "../../../domain/entities/chat";
import { AppError } from "../../../domain/errors/appError";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { ICreateChatUSeCase } from "../../interface/chat/ICreateChatUSeCase";
import { ICreateChatInput } from "../../interfaceType/chatType";

export class CreateChatUseCase implements ICreateChatUSeCase {
  constructor(private chatRepo: IChatRepository) {}
  async execute(input: ICreateChatInput): Promise<Chat> {
    const { participantA, participantB } = input;
    if (participantA === participantB) {
      throw new AppError("Can't create chat with youself");
    }

    const existing = await this.chatRepo.getChatByParticipants({
      participantA,
      participantB,
    });
    if (existing) return existing;

    return this.chatRepo.create({
      participants: [participantA, participantB],
      lastMessage: "",
      lastMessageAt: new Date(),
    });
  }
}
