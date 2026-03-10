import { Types } from "mongoose";
import { Post } from "../../../domain/entities/post";
import { PostDoc, PostModel } from "../../database/models/beautician/postModal";
import { GenericRepository } from "../genericRepository";
import { IPostRepository } from "../../../domain/repositoryInterface/beautician/IPostRepository";
import { PostType } from "../../../domain/enum/userEnum";


export class PostRepository extends GenericRepository<Post,PostDoc> implements IPostRepository{
   constructor(){
    super(PostModel)
   }
  
   async create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
     const doc=await PostModel.create(data)
     return this.map(doc)
   }
  async findByBeauticianIdWithCursor(
  beauticianId: string,
  postType: PostType | null,
  cursor: string | null,
  limit: number
): Promise<{ posts: Post[]; nextCursor: string | null }> {
  const query: Record<string, unknown> = {
    beauticianId: new Types.ObjectId(beauticianId),
    ...(postType && { postType }),
    ...(cursor && { _id: { $lt: new Types.ObjectId(cursor) } }),
  };

  const docs = await PostModel
    .find(query)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = docs.length > limit;
  const sliced = docs.slice(0, limit);

  return {
    posts: sliced.map(doc => this.map(doc)),
    nextCursor: hasMore ? sliced[sliced.length - 1].id.toString() : null,
  };
}

  async findFeedPosts(postType: PostType, cursor: string | null, limit: number) {
  const query: Record<string, unknown> = { postType };

  if (cursor) {
    query._id = { $lt: new Types.ObjectId(cursor) };
  }

  const docs = await PostModel
    .find(query)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = docs.length > limit;
  const sliced = docs.slice(0, limit);

  return {
    posts: sliced.map(doc => this.map(doc)),
    nextCursor: hasMore ? sliced[sliced.length - 1].id.toString() : null,
  };
}

async findMixedFeedPosts(cursorTips: string | null, cursorRent: string | null, limit: number) {
  const half = Math.ceil(limit / 2);

  const [tipsDocs, rentDocs] = await Promise.all([
    PostModel.find({
      postType: PostType.TIPS,
      ...(cursorTips && { _id: { $lt: new Types.ObjectId(cursorTips) } }),
    }).sort({ _id: -1 }).limit(half + 1),

    PostModel.find({
      postType: PostType.RENT,
      ...(cursorRent && { _id: { $lt: new Types.ObjectId(cursorRent) } }),
    }).sort({ _id: -1 }).limit(half + 1),
  ]);

  const hasMoreTips = tipsDocs.length > half;
  const hasMoreRent = rentDocs.length > half;

  const slicedTips = tipsDocs.slice(0, half);
  const slicedRent = rentDocs.slice(0, half);

  
  const posts: Post[] = [];
  const maxLen = Math.max(slicedTips.length, slicedRent.length);

  for (let i = 0; i < maxLen; i++) {
    if (slicedTips[i]) posts.push(this.map(slicedTips[i]));
    if (slicedRent[i]) posts.push(this.map(slicedRent[i]));
  }

  return {
    posts,
    nextCursorTips: hasMoreTips ? slicedTips[slicedTips.length - 1].id.toString() : null,
    nextCursorRent: hasMoreRent ? slicedRent[slicedRent.length - 1].id.toString() : null,
  };
}
   protected map(doc:PostDoc):Post
   {
    const base=super.map(doc)
    return{
     id:base.id.toString(),
     beauticianId:doc.beauticianId.toString(),
     description:doc.description,
     postType:doc.postType,
     location:doc.location,
     media:doc.media??[],
     likesCount:doc.likesCount,
     commentsCount:doc.commentsCount,
     createdAt:doc.createdAt,
     updatedAt:doc.updatedAt
    }
   }
}