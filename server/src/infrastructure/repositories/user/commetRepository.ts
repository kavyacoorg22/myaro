import { Comment } from "../../../domain/entities/comment";
import { ICommentRepository } from "../../../domain/repositoryInterface/User/ICommetRepository";
import { CommentDoc } from "../../database/models/user/CommentModal";
import { GenericRepository } from "../genericRepository";
import { CommentModal } from "../../database/models/user/CommentModal";
import { Types } from "mongoose";
import { CommentType, PostType } from "../../../domain/enum/userEnum";

export class CommentRepository extends GenericRepository<Comment,CommentDoc> implements ICommentRepository{

  constructor(){
    super(CommentModal)
  }

   async create(data: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment> {
     const doc=await CommentModal.create(data)
     return this.map(doc)
   }

async findById(id: string): Promise<Comment | null> {
  const doc = await CommentModal.findOne({ _id: new Types.ObjectId(id), isDeleted: false });
  return doc ? this.map(doc) : null;
}

async findByPostId(postId: string,limit:number,cursor?:string|null): Promise<{comments:Comment[];nextCursor:string|null}> {
    const filter:Record<string,unknown>={
       postId:new Types.ObjectId(postId),
       type:CommentType.POST,
       parentId:null,
       isDeleted:false
    }
    if(cursor)
    {
      filter._id={$lt:new Types.ObjectId(cursor)}
    }
  const docs = await CommentModal.find(filter)
  .sort({_id:-1})
  .limit(limit)
  
  const nextCursor=docs.length===limit?docs[docs.length-1]._id.toString():null
  return {comments: docs.map((doc) => this.map(doc)),nextCursor};
}

 async findReplies(
    parentId: string,
    limit: number = 5,
    cursor?: string | null
  ): Promise<{ replies: Comment[]; nextCursor: string | null }> {
    const filter: Record<string, unknown> = {
      parentId: new Types.ObjectId(parentId),
      isDeleted: false,
    };

    if (cursor) {
      filter._id = { $gt: new Types.ObjectId(cursor) };
    }

    const docs = await CommentModal.find(filter)
      .sort({ _id: 1 })        
      .limit(limit);

    const nextCursor =
      docs.length === limit ? docs[docs.length - 1]._id.toString() : null;

    return { replies: docs.map((doc) => this.map(doc)), nextCursor };
  }

  async incrementReplyCount(commentId: string): Promise<void> {
    await CommentModal.updateOne(
      { _id: new Types.ObjectId(commentId) },
      { $inc: { replyCount: 1 } }
    );
  }

  async decrementReplyCount(commentId: string): Promise<void> {
    await CommentModal.updateOne(
      { _id: new Types.ObjectId(commentId), replyCount: { $gt: 0 } },
      { $inc: { replyCount: -1 } }
    );
  }

async findHomeServiceComments(beauticianId: string, limit: number = 10,
  cursor?: string|null): Promise<{comments:Comment[];nextCursor:string|null}> {

    const filter:Record<string,unknown>={
       beauticianId:new Types.ObjectId(beauticianId),
       type:CommentType.HOME,
       isDeleted:false
    }

     if(cursor)
  {
    filter._id={$lt:new Types.ObjectId(cursor)}
  }
  const docs = await CommentModal.find(filter)
  .sort({_id:-1})
  .limit(limit)

  const nextCursor=docs.length===limit?docs[docs.length-1]._id.toString():null
 
  return{ comments:docs.map((doc) => this.map(doc)),nextCursor};
}

   async delete(id: string): Promise<void> {
  await CommentModal.findByIdAndUpdate(id, { isDeleted: true });
}
   protected map(doc:CommentDoc):Comment
   {
    const base=super.map(doc)
    return{
      id:base.id.toString(),
      userId:doc.userId.toString(),
      postId:doc.postId?.toString(),
      beauticianId:doc.beauticianId?.toString(),
      parentId:doc.parentId?.toString(),
      replyCount: doc.replyCount ?? 0, 
      text:doc.text,
      type:doc.type,
      isDeleted:doc.isDeleted,
      createdAt:doc.createdAt,
      updatedAt:doc.updatedAt
    }
   }



}