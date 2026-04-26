import { PostType } from "../../../../domain/enum/userEnum";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { IGetHomeFeedUseCase } from "../../../interface/beautician/post/IGetHomeFeedUSeCase";
import {
  IGetAllHomeFeedOutput,
} from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";

export class GetHomeFeedUseCase implements IGetHomeFeedUseCase {
  constructor(
    private _postRepo: IPostRepository,
    private _userRepo: IUserRepository,
    private _likeRepo: ILikeRepository,
  ) {}

  async execute(
    userId: string,
    cursor: string | null = null,
    limit: number = 10,
  ): Promise<IGetAllHomeFeedOutput> {
    const { posts, nextCursor } = await this._postRepo.findFeedPosts(
      PostType.POST,
      cursor,
      limit,
    );

    const beauticianIds = [...new Set(posts.map((p) => p.beauticianId))];
    const users = await this._userRepo.findUsersByIds(beauticianIds);
    const userMap = new Map(users.map((u) => [u.id, u]));
    const postIds = posts.map((p) => p.id);
    const likedPostIds = await this._likeRepo.findLikedPostIds(userId, postIds);
    const likedSet = new Set(likedPostIds);

    const enrichedPosts = posts.map((post) => {
      const user = userMap.get(post.beauticianId);
      return toGetFeedDto(post, user!, likedSet.has(post.id));
    });

    return { posts: enrichedPosts, nextCursor };
  }
}
