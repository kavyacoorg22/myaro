import { Post } from "../../../../domain/entities/post";
import { User } from "../../../../domain/entities/User";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ISearchPostUSeCase } from "../../../interface/beautician/post/ISearchPostUseCase";
import { IGetPostSearchResult } from "../../../interfaceType/beauticianType";
import { toGetFeedDto } from "../../../mapper/beauticianMapper";

const SEARCH_LIMIT = 10;

export class SearchPostUseCase implements ISearchPostUSeCase {
  constructor(
    private userRepo: IUserRepository,
    private postRepo: IPostRepository
  ) {}

  async execute(query: string, cursor: string | null): Promise<IGetPostSearchResult> {
    if (!query || query.trim().length === 0) return { posts: [], nextCursor: null };

    const [matchingBeauticians, locationPosts] = await Promise.all([
      this.userRepo.searchBeauticians(query),
      this.postRepo.searchByLocation(query, cursor, SEARCH_LIMIT + 1),
    ]);

    const beauticianIds = matchingBeauticians.map((u) => u.id);
    const beauticianPosts =
      beauticianIds.length > 0
        ? await this.postRepo.findByBeauticianIds(beauticianIds, cursor, SEARCH_LIMIT + 1)
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

    // Sort merged by createdAt desc (since two sources are interleaved)
    merged.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Determine if there's a next page
    const hasMore = merged.length > SEARCH_LIMIT;
    const paginated = hasMore ? merged.slice(0, SEARCH_LIMIT) : merged;
    const nextCursor = hasMore ? paginated[paginated.length - 1].id : null;

    // Build user map
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
      const extraUsers = await this.userRepo.findUsersByIds(missingIds);
      extraUsers.forEach((u) => userMap.set(u.id, u));
    }

    return {
      posts: paginated.map((post) => {
        const user = userMap.get(post.beauticianId)!;
        return toGetFeedDto(post, user);
      }),
      nextCursor,
    };
  }
}