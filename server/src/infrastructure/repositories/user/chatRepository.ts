import { Types } from "mongoose";
import { IGetChatByParticipants } from "../../../application/interface/chat/IGetChatByParticipants";
import { IGetChatByParticipantsInput } from "../../../application/interfaceType/chatType";
import { Chat } from "../../../domain/entities/chat";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { ChatDoc, ChatModel } from "../../database/models/user/chatModal";
import { GenericRepository } from "../genericRepository";

export class ChatRepository
  extends GenericRepository<Chat, ChatDoc>
  implements IChatRepository
{
  constructor() {
    super(ChatModel);
  }
  async create(
    data: Omit<Chat, "id" | "createdAt" | "updatedAt">,
  ): Promise<Chat> {
    const doc = await ChatModel.create(data);
    return this.map(doc);
  }
  async findById(id: string): Promise<Chat | null> {
    const doc = await ChatModel.findById(id);
    return doc ? this.map(doc) : null;
  }

  async getChatByParticipants(
    input: IGetChatByParticipantsInput,
  ): Promise<Chat | null> {
    const { participantA, participantB } = input;
    const doc = await ChatModel.findOne({
      participants: {
        $all: [
          new Types.ObjectId(participantA),
          new Types.ObjectId(participantB),
        ],
      },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    });
    return doc ? this.map(doc) : null;
  }

  async updateLastMessage(
    chatId: string,
    message: string,
    at: Date,
  ): Promise<void> {
    await ChatModel.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message,
        lastMessageAt: at,
      },
      { new: false },
    );
  }

  async findByUserId(
    userId: string,
    limit = 21,
    cursor?: string,
  ): Promise<Chat[]> {
    const query: any = { participants: new Types.ObjectId(userId) };

    if (cursor) {
      query.lastMessageAt = { $lt: new Date(cursor) };
    }

    const docs = await ChatModel.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      

    return docs.map((doc) => this.map(doc));
  }
  protected map(doc: ChatDoc): Chat {
    const base = super.map(doc);
    return {
      id: base.id.toString(),
      participants: doc.participants.map((ele) => ele.toString()),
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
