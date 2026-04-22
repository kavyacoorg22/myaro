import { IFollowingListDto } from "../dtos/follow";

export interface IGetFollowingListResponse{
  data:IFollowingListDto[],
  nextCursor:string|null
}