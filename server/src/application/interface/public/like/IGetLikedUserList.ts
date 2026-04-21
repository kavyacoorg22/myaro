import { IGetLikedUserListResponse } from "../../../interfaceType/commetLike";

export interface IGetLikedUserListUseCase{
  execute(postId:string,limit:number,cursor?:string|null):Promise<IGetLikedUserListResponse>
}