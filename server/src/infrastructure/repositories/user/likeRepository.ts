import { GenericRepository } from "../genericRepository";
import { Types } from "mongoose";
import { Like } from "../../../domain/entities/like";
import { LikeDoc, likeModal } from "../../database/models/user/likeModal";
import { ILikeRepository } from "../../../domain/repositoryInterface/User/ILikeRepository";

export class LikeRepository
  extends GenericRepository<Like, LikeDoc>
  implements ILikeRepository
{
  constructor() {
    super(likeModal);
  }

  async create(
    data: Omit<Like, "id" | "createdAt" | "updatedAt">,
  ): Promise<Like> {
    const doc = await likeModal.create(data);
    return this.map(doc);
  }

  async findByUserIDAndPostId(
    userID: string,
    postId: string,
  ): Promise<Like | null> {
    const doc = await likeModal.findOne({
      userId: new Types.ObjectId(userID),
      postId: new Types.ObjectId(postId),
    });
    return doc ? this.map(doc) : null;
  }

  async findLikedPostIds(userId: string, postIds: string[]): Promise<string[]> {
    const docs = await likeModal.find({
      userId: new Types.ObjectId(userId),
      postId: { $in: postIds.map((id) => new Types.ObjectId(id)) }, // only checks these 10-12 ids
    });
    console.log("userId:", userId);
    console.log("postIds passed in:", postIds);
    console.log("docs found:", docs.length);
    console.log(
      "returned postIds:",
      docs.map((doc) => doc.postId.toString()),
    );
    return docs.map((doc) => doc.postId.toString());
  }

  async findByPostId(
    postId: string,
    limit: number = 10,
    cursor?: string | null,
  ): Promise<{ likes: Like[]; nextCursor: string | null }> {
    const query: {
      postId: Types.ObjectId;
      _id?: { $lt: Types.ObjectId };
    } = {
      postId: new Types.ObjectId(postId),
    };
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }
    const docs = await likeModal
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasNextPage = docs.length > limit;

    if (hasNextPage) {
      docs.pop();
    }

    return {
      likes: docs.map((doc) => this.map(doc)),
      nextCursor: hasNextPage ? docs[docs.length - 1]._id.toString() : null,
    };
  }

  async delete(userId: string, postId: string): Promise<void> {
    await likeModal.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });
  }
  protected map(doc: LikeDoc): Like {
    const base = super.map(doc);
    return {
      id: base.id.toString(),
      userId: doc.userId.toString(),
      postId: doc.postId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
