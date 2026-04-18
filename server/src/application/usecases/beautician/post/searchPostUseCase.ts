import { Post } from "../../../../domain/entities/post";
import { User } from "../../../../domain/entities/User";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { ISearchPostUSeCase } from "../../../interface/beautician/post/ISearchPostUseCase";
import { IGetPostSearchResult } from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";

const SEARCH_LIMIT = 10;

export class SearchPostUseCase implements ISearchPostUSeCase {
  constructor(
    private _userRepo: IUserRepository,
    private _postRepo: IPostRepository,
    private _likeRepo: ILikeRepository,
  ) {}

  async execute(
    query: string,
    cursor: string | null,
    userId?: string,
  ): Promise<IGetPostSearchResult> {
    if (!query || query.trim().length === 0) return { posts: [], nextCursor: null };

    const [matchingBeauticians, locationPosts] = await Promise.all([
      this._userRepo.searchBeauticians(query),
      this._postRepo.searchByLocation(query, cursor, SEARCH_LIMIT + 1),
    ]);

    const beauticianIds = matchingBeauticians.map((u) => u.id);
    const beauticianPosts =
      beauticianIds.length > 0
        ? await this._postRepo.findByBeauticianIds(beauticianIds, cursor, SEARCH_LIMIT + 1)
        : [];

    // Deduplicate
    const seen = new Set<string>();
    const merged: Post[] = [];

    for (const post of [...beauticianPosts, ...locationPosts]) {
      if (!seen.has(post.id)) {
        seen.add(post.id);
        merged.push(post);
      }
    }

    if (merged.length === 0) return { posts: [], nextCursor: null };

    merged.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const hasMore = merged.length > SEARCH_LIMIT;
    const paginated = hasMore ? merged.slice(0, SEARCH_LIMIT) : merged;
    const nextCursor = hasMore ? paginated[paginated.length - 1].id : null;

    const userMap = new Map<string, User>(
      matchingBeauticians.map((u) => [u.id, u])
    );

    const missingIds = [
      ...new Set(
        paginated
          .map((p) => p.beauticianId)
          .filter((id) => !userMap.has(id))
      ),
    ];

    if (missingIds.length > 0) {
      const extraUsers = await this._userRepo.findUsersByIds(missingIds);
      extraUsers.forEach((u) => userMap.set(u.id, u));
    }

    // ✅ Only fetch likes if userId is present
    const likedSet = new Set<string>();
    if (userId) {
      const postIds = paginated.map((p) => p.id);
      const likedPostIds = await this._likeRepo.findLikedPostIds(userId, postIds);
      likedPostIds.forEach((id) => likedSet.add(id));
    }

    return {
      posts: paginated.map((post) => {
        const user = userMap.get(post.beauticianId)!;
        return toGetFeedDto(post, user, likedSet.has(post.id));
      }),
      nextCursor,
    };
  }
}