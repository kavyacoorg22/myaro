import { Types } from "mongoose";
import { Follow } from "../../../domain/entities/follow";
import { IFollowRepository } from "../../../domain/repositoryInterface/User/IFollowRepository";
import { FollowDoc, FollowModel } from "../../database/models/user/followModal";
import { GenericRepository } from "../genericRepository";

export class FollowRepository
  extends GenericRepository<Follow, FollowDoc>
  implements IFollowRepository
{
  constructor() {
    super(FollowModel);
  }

  async create(
    data: Omit<Follow, "id" | "createdAt" | "updatedAt">,
  ): Promise<Follow> {
    const doc = await FollowModel.create(data);
    return this.map(doc);
  }

  async unFollow(userId: string, beauticianId: string): Promise<void> {
    await FollowModel.deleteOne({ userId, beauticianId });
  }

  async findById(id: string): Promise<Follow | null> {
    const doc = await FollowModel.findById(id);
    return doc ? this.map(doc) : null;
  }

  async getFollowingList(
    userId: string,
    limit: number = 10,
    cursor?: string,
  ): Promise<Follow[]> {
    const filter: {
      userId: Types.ObjectId;
      _id?: { $gt: Types.ObjectId };
    } = { userId: new Types.ObjectId(userId) };

    if (cursor) {
      filter._id = { $gt: new Types.ObjectId(cursor) };
    }

    const docs = await FollowModel.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .exec();

    return docs.map((doc) => this.map(doc));
  }

  async checkFollowing(userId: string, beauticianId: string): Promise<boolean> {
    const doc = await FollowModel.findOne({ userId, beauticianId });
    return doc !== null;
  }

  async followingCount(userId: string): Promise<number> {
    return FollowModel.countDocuments({ userId });
  }

  protected map(doc: FollowDoc): Follow {
    const base = super.map(doc);
    return {
      id: base.id.toString(),
      userId: doc.userId.toString(),
      beauticianId: doc.beauticianId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
