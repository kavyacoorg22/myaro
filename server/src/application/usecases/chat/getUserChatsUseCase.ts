import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { IChatListDto } from "../../dtos/chat";
import { IGetUserChatsUseCase } from "../../interface/chat/IGetUserChatUseCase";
import {
  IGetUserChatsInput,
  IGetUserChatsOutput,
} from "../../interfaceType/chatType";
import { toGetUserChats } from "../../mapper/chatMapper";

export class GetUserChatsUseCase implements IGetUserChatsUseCase {
  constructor(
    private chatRepo: IChatRepository,
    private userRepo: IUserRepository,
    private messageRepo: IMessageRepository,
  ) {}

  async execute({
    userId,
    limit = 20,
    cursor,
  }: IGetUserChatsInput): Promise<IGetUserChatsOutput> {
    if (!userId) throw new Error("userId is required");

    const chats = await this.chatRepo.findByUserId(userId, limit + 1, cursor);
    const hasMore = chats.length > limit;
    if (hasMore) chats.pop();

    const nextCursor = hasMore
      ? chats[chats.length - 1].lastMessageAt.toISOString()
      : null;

    const otherUserIds = chats
      .map((chat) => chat.participants.find((p) => p !== userId))
      .filter((id): id is string => id !== undefined);

    const [users, unreadCounts] = await Promise.all([
      this.userRepo.findUsersByIds(otherUserIds),
      Promise.all(
        chats.map((chat) => this.messageRepo.getUnreadCount(chat.id, userId)),
      ),
    ]);

    const userMap = new Map(users.map((u) => [u.id, u]));

    const chatsFiltered = chats
      .map((chat, index) => {
        const otherUserId = chat.participants.find((p) => p !== userId);
        if (!otherUserId) return null;

        const user = userMap.get(otherUserId);
        if (!user) return null;

        return toGetUserChats(chat, user, unreadCounts[index]);
      })
      .filter((c): c is IChatListDto => c !== null);

    return { chats: chatsFiltered, nextCursor, hasMore };
  }
}
