import { IGetFollowingListResponse } from "../../../interfaceType/followType";

export interface IGetFollowingListUseCase{
  execute(userId:string,cursor?:string):Promise<IGetFollowingListResponse>
}