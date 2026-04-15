import { CommentType } from "../../domain/enum/userEnum";
import { IGetHomeServiceCommentsDto, IGetPostCommentsDto, IGetReplyDto } from "../dtos/likeCommet";

export  interface IAddCommentInput{
userId:string,
postId?:string,
beauticianId?:string,
text:string,
type:CommentType,
parentId?:string
}

export interface IGetPostCommentsOutPut{
 comments:IGetPostCommentsDto[],
 nextCursor:string|null
}

export interface IGetHomeServiceCommentsOutPut{
comments:IGetHomeServiceCommentsDto[]
nextCursor:string|null
}

export interface IGetRepliesOutput {
  replies: IGetReplyDto[];
  nextCursor: string | null;
}