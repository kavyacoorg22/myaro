import { CommentType } from "../enum/userEnum";

export interface Comment{
   id:string,
   userId:string,
   postId?:string,
   beauticianId?:string,
   text:string,
   type:CommentType,
   isDeleted:boolean,
   createdAt:Date,
   updatedAt:Date,
}