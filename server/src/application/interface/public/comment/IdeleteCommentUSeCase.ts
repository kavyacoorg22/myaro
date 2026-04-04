
export interface IdeleteCommentUseCase{
  execute(userId:string,commentId:string,postId:string|null):Promise<void>
}