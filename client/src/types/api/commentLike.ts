import type { IGetHomeServiceCommentsDto, IGetPostCommentsDto, IGetReplyDto } from "../dtos/commetLike"
import type { BackendResponse } from "./api"

export interface IGetPostCommentsOutPutData{
 comments:IGetPostCommentsDto[],
 nextCursor:string|null
}

export interface IGetHomeServiceCommentsOutPutData{
comments:IGetHomeServiceCommentsDto[]
nextCursor:string|null
}

export interface IGetRepliesOutput {
  replies: IGetReplyDto[];
  nextCursor: string | null;
}
export interface IGetRepliesInput {
    parentId: string,
    limit?: number,
    cursor?: string | null
}
export type IGetPostCommentsOutPut=BackendResponse<IGetPostCommentsOutPutData>
export type IGetHomeServiceCommentsOutPut=BackendResponse<IGetHomeServiceCommentsOutPutData>
