import type { CommentTypes } from "../../constants/types/commentLike"

export interface IGetHomeServiceCommentsDto{
commentId:string,
  beauticianId:string,
  userId:string,
  text:string,
  type:CommentTypes,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  profileImg?:string,
  createdAt:string
}


export interface IGetPostCommentsDto{
  commentId:string,
  postId:string,
  userId:string,
  text:string,
  type:CommentTypes,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  profileImg?:string,
  createdAt:string
}