


export interface IRemoveLikeUSeCase{
  execute(userId:string,postId:string):Promise<void>
}