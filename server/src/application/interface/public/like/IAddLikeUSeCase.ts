

export interface IAddLikeUSeCase{
  execute(userId:string,postId:string):Promise<void>
}