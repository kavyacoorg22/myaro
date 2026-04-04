import { Post } from "../../entities/post";
import { PostType } from "../../enum/userEnum";

export interface IPostRepository {
  create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  findByBeauticianIdWithCursor(beauticianId: string, postType: PostType, cursor: string | null, limit: number): Promise<{ posts: Post[]; nextCursor: string | null }>;
  findById(id:string):Promise<Post|null>
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

  findByBeauticianIds(beauticianIds: string[], nextCursor: string | null, limit: number): Promise<Post[]>;
searchByLocation(query: string, nextCursor: string | null, limit: number): Promise<Post[]>;
incrementLikesCount(postId: string): Promise<void>;
decrementLikesCount(postId: string): Promise<void>;
incrementCommentsCount(postId: string): Promise<void>;
decrementCommentsCount(postId: string): Promise<void>;

}
