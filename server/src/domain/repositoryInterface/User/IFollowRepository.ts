import { Follow } from "../../entities/follow";

export interface IFollowRepository {
  create(data: Omit<Follow, "id" | "createdAt" | "updatedAt">): Promise<Follow>;
  unFollow(userId: string, beauticianId: string): Promise<void>;
  findById(id: string): Promise<Follow | null>;
  getFollowingList(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<Follow[]>;
  checkFollowing(userId: string, beauticianId: string): Promise<boolean>;
  followingCount(userId: string): Promise<number>;
}
