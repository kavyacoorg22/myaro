import type { CommentTypes } from "../../constants/types/commentLike"

export interface IGetHomeServiceCommentsDto{
  beauticianId:string,
  userId:string,
  text:string,
  type:CommentTypes,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  createdAt:string
}


export interface IGetPostCommentsDto{
  postId:string,
  userId:string,
  text:string,
  type:CommentTypes,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  createdAt:string
}