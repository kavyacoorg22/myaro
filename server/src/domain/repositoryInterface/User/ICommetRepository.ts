import { Comment } from "../../entities/comment"


export interface ICommentRepository{
  create(data:Omit<Comment,'id'|'createdAt'|'updatedAt'>):Promise<Comment>
    delete(id: string): Promise<void>;
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId:string,limit:number,cursor?:string):Promise<{comments:Comment[];nextCursor:string|null}>
  findReplies(parentId:string,limit:number,cursor?:string|null):Promise<{ replies: Comment[]; nextCursor: string | null }>
  incrementReplyCount(commentId: string): Promise<void>
   decrementReplyCount(commentId: string): Promise<void>
  findHomeServiceComments(beauticianId:string,limit:number,cursor?:string|null):Promise<{comments:Comment[];nextCursor:string|null}>
getRatingSummary(beauticianId: string): Promise<{ avgRating: number; totalReviews: number }>;

}