import { Like } from "../../entities/like"


export interface ILikeRepository{
  create(data:Omit<Like,'id'|'createdAt'|'updatedAt'>):Promise<Like>
    delete(userId: string, postId: string): Promise<void>;
  findByUserIDAndPostId(userID:string,postId:string):Promise<Like|null>
    findLikedPostIds(userID:string,postIds:string[]):Promise<string[]>
  findByPostId(postId:string,limit:number,cursor?:string|null):Promise<{likes:Like[],nextCursor:string|null}>
}