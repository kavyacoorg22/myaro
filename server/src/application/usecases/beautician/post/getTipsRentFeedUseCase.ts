import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IGetTipsRentUseCase } from "../../../interface/beautician/post/IGetTipsRentUseCase";
import {

  IGetTipsAndRentOutput,
} from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";

export class GetTipsRentFeedUseCase implements IGetTipsRentUseCase {
  constructor(
    private postRepo: IPostRepository,
    private userRepo: IUserRepository,
  ) {}

  async execute(
    cursorTips: string | null,
    cursorRent: string | null,
    limit: number = 10,
  ): Promise<IGetTipsAndRentOutput> {
    const { posts, nextCursorTips, nextCursorRent } =
      await this.postRepo.findMixedFeedPosts(cursorTips, cursorRent, limit);

    const beauticianIds = [...new Set(posts.map((p) => p.beauticianId))];
    const users = await this.userRepo.findUsersByIds(beauticianIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedPosts = posts.map((post) => {
      const user = userMap.get(post.beauticianId);
      return toGetFeedDto(post, user!);
    });

    return { posts: enrichedPosts, nextCursorTips, nextCursorRent };
  }
}
