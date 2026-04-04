import type { IGetHomeServiceCommentsDto, IGetPostCommentsDto } from "../dtos/commetLike"

export interface IGetPostCommentsOutPut{
 comments:IGetPostCommentsDto[],
 nextCursor:string|null
}

export interface IGetHomeServiceCommentsOutPut{
comments:IGetHomeServiceCommentsDto[]
nextCursor:string|null
}