import { CommentType } from "../../domain/enum/userEnum";
import { IGetHomeServiceCommentsDto, IGetPostCommentsDto } from "../dtos/likeCommet";

export  interface IAddCommentInput{
userId:string,
postId?:string,
beauticianId?:string,
text:string,
type:CommentType
}

export interface IGetPostCommentsOutPut{
 comments:IGetPostCommentsDto[],
 nextCursor:string|null
}

export interface IGetHomeServiceCommentsOutPut{
comments:IGetHomeServiceCommentsDto[]
nextCursor:string|null
}