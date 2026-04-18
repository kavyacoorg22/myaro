import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { CommentRepository } from "../../../../infrastructure/repositories/user/commetRepository";
import { IGetReplyDto } from "../../../dtos/likeCommet";
import { IGetRepliesUseCase } from "../../../interface/public/comment/IgetReplyCommentUSeCase";
import { IGetRepliesOutput } from "../../../interfaceType/commetLike";
import { toGetReplyDto } from "../../../mapper/likeCommentMapper";

export class GetRepliesUseCase implements IGetRepliesUseCase {
  constructor(
    private _commentRepo: CommentRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(
    parentId: string,
    limit: number = 5,
    cursor?: string | null
  ): Promise<IGetRepliesOutput> {

    const { replies, nextCursor } = await this._commentRepo.findReplies(
      parentId,
      limit,
      cursor
    );

    if (replies.length === 0) {
      return { replies: [], nextCursor: null };
    }

    const userIds = [...new Set(replies.map((r) => r.userId))];

    const userData = await this._userRepo.findUsersByIds(userIds);
    const userMap = new Map(userData.map((u) => [u.id, u]));

    const enrichedReplies = replies
      .map((r) => {
        const user = userMap.get(r.userId);
        if (!user) return null;
        return toGetReplyDto(r, user);
      })
      .filter((r): r is IGetReplyDto => r !== null);

    return { replies: enrichedReplies, nextCursor };
  }
}