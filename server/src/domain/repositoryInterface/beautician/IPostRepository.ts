import { Post } from "../../entities/post";
import { PostType } from "../../enum/userEnum";

export interface IPostRepository {
  create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  findByBeauticianIdWithCursor(beauticianId: string, postType: PostType, cursor: string | null, limit: number): Promise<{ posts: Post[]; nextCursor: string | null }>;

  findFeedPosts(
    postType: PostType,
    cursor: string | null,
    limit: number,
  ): Promise<{ posts: Post[]; nextCursor: string | null }>;
  findMixedFeedPosts(
    cursorTips: string | null,
    cursorRent: string | null,
    limit: number,
  ): Promise<{
    posts: Post[];
    nextCursorTips: string | null;
    nextCursorRent: string | null;
  }>;
}
