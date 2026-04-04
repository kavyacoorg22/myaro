import { PostType } from "../../../../domain/enum/userEnum";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { IGetHomeFeedUseCase } from "../../../interface/beautician/post/IGetHomeFeedUSeCase";
import { IGetAllHomeFeedOutput, IGetBeauticianPostOutPut } from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";

export class GetHomeFeedUseCase implements IGetHomeFeedUseCase {
  constructor(
    private postRepo: IPostRepository,
    private userRepo: IUserRepository,
    private likeRepo: ILikeRepository,
  ) {}

  async execute(userId: string, cursor: string | null = null, limit: number = 10): Promise<IGetAllHomeFeedOutput> {
    const { posts, nextCursor } = await this.postRepo.findFeedPosts(PostType.POST, cursor, limit);

    const beauticianIds = [...new Set(posts.map((p) => p.beauticianId))];
    const users = await this.userRepo.findUsersByIds(beauticianIds);
    const userMap = new Map(users.map((u) => [u.id, u]));
const postIds = posts.map((p) => p.id);
console.log("post.id samples:", postIds.slice(0, 3));
const likedPostIds = await this.likeRepo.findLikedPostIds(userId, postIds);
console.log("likedPostIds returned:", likedPostIds);
    const likedSet = new Set(likedPostIds);

    const enrichedPosts = posts.map((post) => {
      const user = userMap.get(post.beauticianId);
      console.log(likedSet.has(post.id))
      return toGetFeedDto(post, user!, likedSet.has(post.id));
    });

    return { posts: enrichedPosts, nextCursor };
  }
}