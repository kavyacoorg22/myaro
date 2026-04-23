import { CommentType } from "../enum/userEnum";

export interface Comment{
   id:string,
   userId:string,
   postId?:string,
   beauticianId?:string,
   parentId?:string|null,
   replyCount?:number,
   rating?:number,
   text:string,
   type:CommentType,
   isDeleted:boolean,
   createdAt:Date,
   updatedAt:Date,
}