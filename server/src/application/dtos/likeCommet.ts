import { CommentType } from "../../domain/enum/userEnum";

export interface IGetHomeServiceCommentsDto{
  beauticianId:string,
  userId:string,
  text:string,
  type:CommentType,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  createdAt:string
}


export interface IGetPostCommentsDto{
  postId:string,
  userId:string,
  text:string,
  type:CommentType,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  createdAt:string
}