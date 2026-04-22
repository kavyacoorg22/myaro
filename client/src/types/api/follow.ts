import type { IFollowingListDto } from "../dtos/follow";
import type { BackendResponse } from "./api";

export interface IGetFollowingListResponseData{
  data:IFollowingListDto[],
  nextCursor:string|null
}

export interface IUnFollowBeauticianResponseData{
  isFollowing:boolean
}

export interface IFollowBeauticianResponseData{
  isFollowing:boolean
}
export type IUnFollowBeauticianResponse=BackendResponse<IUnFollowBeauticianResponseData>
export type IFollowBeauticianResponse=BackendResponse<IFollowBeauticianResponseData>
export type IGetFollowingListResponse=BackendResponse<IGetFollowingListResponseData>
