import { CommentType } from "../../domain/enum/userEnum";

export interface IGetHomeServiceCommentsDto{
  commentId:string,
  beauticianId:string,
  userId:string,
  text:string,
  type:CommentType,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  profileImg?:string,
    rating?: number;
  createdAt:string

}


export interface IGetPostCommentsDto{
  commentId:string,
  postId:string,
  userId:string,
  text:string,
  type:CommentType,
  isDeleted:boolean,
  userName:string,
  fullName:string,
  profileImg?:string,
  createdAt:string
  replyCount:number
}

export interface IGetReplyDto {
  id: string;
  text: string;
  userId: string;
  parentId: string;
  user: {
    id: string;
    name: string;
    profileImg: string;
  };
  createdAt: Date;
}

export interface IGetLikedUserListDto{
  id:string,
  fullName:string,
  userName:string,
  profileImg?:string
}