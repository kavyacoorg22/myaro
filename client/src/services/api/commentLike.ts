import {  customerApiRoute } from "../../constants/apiRoutes/customerRoute"
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { BackendResponse } from "../../types/api/api"
import type { IGetHomeServiceCommentsOutPut, IGetLikedUserListResponse, IGetPostCommentsOutPut, IGetRepliesOutput } from "../../types/api/commentLike"
import api, { axiosWrapper } from "../axiosWrapper"


export const CommentLikeApi={
  addLike:async(postId:string)=>{
    return await axiosWrapper<BackendResponse>(api.post(publicApiRoutes.addLike.replace(':postId',postId)))
  },
   removeLike:async(postId:string)=>{
    return await axiosWrapper<BackendResponse>(api.delete(publicApiRoutes.removeLike.replace(':postId',postId)))
  },
  addPostComment:async(text:string,postId:string,parentId?:string)=>{
    return await axiosWrapper<BackendResponse>(api.post(publicApiRoutes.addPostComment.replace(':postId',postId),
  {text,parentId}
  ))
  },
  getPostComment:async(postId:string,limit:number=10,cursor?:string|null)=>{
     const params={
      limit,
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetPostCommentsOutPut>(api.get(publicApiRoutes.getPostComment.replace(':postId',postId),{params}))
  },
  deletePostComment:async(postId:string,commentId:string)=>{
    return await axiosWrapper<BackendResponse>(api.delete(publicApiRoutes.deleteComment.replace(':postId',postId)
      .replace(':commentId', commentId)
  ))
  },
  addHomeServiceComment:async(text:string,beauticianId:string,rating:number)=>{
    return await axiosWrapper<BackendResponse>(api.post(customerApiRoute.addHomeServiceComment.replace(':beauticianId',beauticianId),
  {text,rating}
  ))
  },
   getHomeServiceComment:async(beauticianId:string,limit:number=10,cursor?:string|null)=>{
    const params={
      limit,
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetHomeServiceCommentsOutPut>(api.get(customerApiRoute.getHomeServiceComment.replace(':beauticianId',beauticianId),{params}))
  },
     getCommentReply:async(commentId:string,limit:number=5,cursor?:string|null)=>{
    const params={
      limit,
      ...(cursor&&{cursor})
    }
    return await axiosWrapper<IGetRepliesOutput>(api.get(publicApiRoutes.getReplyComment.replace(':commentId',commentId),{params}))
  },
  getUserLikeList:async(postId:string,limit:number,cursor?:string|null)=>{
     const params={
      limit,
      ...(cursor&&{cursor})
    }
        return await axiosWrapper<IGetLikedUserListResponse>(api.get(publicApiRoutes.getLikeList.replace(':postId',postId),{params}))
  }

}