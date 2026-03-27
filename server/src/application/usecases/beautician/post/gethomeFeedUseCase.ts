import { PostType } from "../../../../domain/enum/userEnum";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IGetHomeFeedUseCase } from "../../../interface/beautician/post/IGetHomeFeedUSeCase";
import { IGetAllHomeFeedOutput, IGetBeauticianPostOutPut } from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";


export class GetHomeFeedUseCase implements IGetHomeFeedUseCase{

  constructor(private postRepo:IPostRepository,private userRepo:IUserRepository){}

  async execute(cursor: string | null = null, limit: number = 10): Promise<IGetAllHomeFeedOutput> {
  const { posts, nextCursor } = await this.postRepo.findFeedPosts(PostType.POST, cursor, limit);

  const beauticianIds = [...new Set(posts.map(p => p.beauticianId))];

  const users = await this.userRepo.findUsersByIds(beauticianIds);

  const userMap = new Map(users.map(u => [u.id, u]));
  const enrichedPosts = posts.map((post) => {
  const user = userMap.get(post.beauticianId);
  return toGetFeedDto(post, user!);
});

return { posts: enrichedPosts, nextCursor };
}
}