import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ICommentRepository } from "../../../../domain/repositoryInterface/User/ICommetRepository";
import { IGetHomeServiceCommentsDto } from "../../../dtos/likeCommet";
import { IGetHomeServiceCommetsUseCase } from "../../../interface/public/comment/IgetHomeServiceCommetsUSeCase";
import { IGetHomeServiceCommentsOutPut } from "../../../interfaceType/commetLike";
import { toGetHomeServiceCommentDto } from "../../../mapper/likeCommentMapper";

export class GetHomeServiceUseCase implements IGetHomeServiceCommetsUseCase {
  constructor(
    private _commentRepo: ICommentRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(
    beauticianId: string,
    limit: number = 10,
    cursor?: string | null
  ): Promise<IGetHomeServiceCommentsOutPut> {

    const [{ comments, nextCursor }, { avgRating, totalReviews }] =
      await Promise.all([
        this._commentRepo.findHomeServiceComments(beauticianId, limit, cursor),
        this._commentRepo.getRatingSummary(beauticianId),
      ]);

    const userIds = [...new Set(comments.map((c) => c.userId))];

    const userData = await this._userRepo.findUsersByIds(userIds);

    const userMap = new Map(userData.map((u) => [u.id, u]));

    const enrichedComments = comments
      .map((cm) => {
        const user = userMap.get(cm.userId);
        if (!user) return null;
        return toGetHomeServiceCommentDto(cm, user);
      })
      .filter((c): c is IGetHomeServiceCommentsDto => c !== null);

    return {
      comments: enrichedComments,
      nextCursor,
      avgRating,
      totalReviews,
    };
  }
}