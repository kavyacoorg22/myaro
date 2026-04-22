
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { BackendResponse } from "../../types/api/api"
import type { IFollowBeauticianResponse, IGetFollowingListResponse, IUnFollowBeauticianResponse } from "../../types/api/follow"
import api, { axiosWrapper } from "../axiosWrapper"


export const FollowApi={
  getFollowingList:async(cursor?:string)=>{
    const params={
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetFollowingListResponse>(api.get(publicApiRoutes.getFollowingList,{params}))
  },
   followBeautician:async(beauticianId:string)=>{
    return await axiosWrapper<IFollowBeauticianResponse>(api.post(publicApiRoutes.followBeautician.replace(':beauticianId',beauticianId)))
  },
    unfollowBeautician:async(beauticianId:string)=>{
    return await axiosWrapper<IUnFollowBeauticianResponse>(api.delete(publicApiRoutes.followBeautician.replace(':beauticianId',beauticianId)))
  },
}

