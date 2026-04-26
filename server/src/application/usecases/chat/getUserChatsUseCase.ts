import { Beautician } from "../../../domain/entities/Beautician";
import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IChatRepository } from "../../../domain/repositoryInterface/User/chat/IChatRepository";
import { IMessageRepository } from "../../../domain/repositoryInterface/User/chat/IMessageRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IChatListDto } from "../../dtos/chat";
import { IGetUserChatsUseCase } from "../../interface/chat/IGetUserChatUseCase";
import {
  IGetUserChatsInput,
  IGetUserChatsOutput,
} from "../../interfaceType/chatType";
import { toGetUserChats } from "../../mapper/chatMapper";

export class GetUserChatsUseCase implements IGetUserChatsUseCase {
  constructor(
    private _chatRepo: IChatRepository,
    private _userRepo: IUserRepository,
    private _messageRepo: IMessageRepository,
    private _beauticianRepo: IBeauticianRepository,
  ) {}

  async execute({
    userId,
    limit = 20,
    cursor,
  }: IGetUserChatsInput): Promise<IGetUserChatsOutput> {
    if (!userId)
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );

    const chats = await this._chatRepo.findByUserId(userId, limit + 1, cursor);
    const hasMore = chats.length > limit;
    if (hasMore) chats.pop();

    const nextCursor = hasMore
      ? chats[chats.length - 1].lastMessageAt.toISOString()
      : null;

    const otherUserIds = chats
      .map((chat) => chat.participants.find((p) => p !== userId))
      .filter((id): id is string => id !== undefined);

    const [users, unreadCounts] = await Promise.all([
      this._userRepo.findUsersByIds(otherUserIds),
      Promise.all(
        chats.map((chat) => this._messageRepo.getUnreadCount(chat.id, userId)),
      ),
    ]);

    const userMap = new Map(users.map((u) => [u.id, u]));

    const beauticianUsers = users.filter((u) => u.role === "beautician");
    const beauticianMap = new Map<string, Beautician>();

    if (beauticianUsers.length > 0) {
      await Promise.all(
        beauticianUsers.map(async (u) => {
          const b = await this._beauticianRepo.findByUserId(u.id);
          if (b) beauticianMap.set(u.id, b);
        }),
      );
    }

    const chatsFiltered = chats
      .map((chat, index) => {
        const otherUserId = chat.participants.find((p) => p !== userId);
        if (!otherUserId) return null;

        const user = userMap.get(otherUserId);
        if (!user) return null;

        const beautician = beauticianMap.get(otherUserId) ?? null; // ✅

        return toGetUserChats(chat, user, unreadCounts[index], beautician);
      })
      .filter((c): c is IChatListDto => c !== null)
      .filter((c) => c.lastMessage !== "");
    return { chats: chatsFiltered, nextCursor, hasMore };
  }
}
