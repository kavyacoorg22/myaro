import { Comment } from "../../domain/entities/comment";
import { User } from "../../domain/entities/User";
import { getTimeAgo } from "../../utils/schedule/dateHelper";
import { IGetHomeServiceCommentsDto, IGetPostCommentsDto } from "../dtos/likeCommet";


export function toGetHomeServiceCommentDto(cm:Comment,user:User):IGetHomeServiceCommentsDto{

  return{
    commentId:cm.id,
     beauticianId:cm.beauticianId??'',
     userId:cm.userId,
     text:cm.text,
     type:cm.type,
     isDeleted:cm.isDeleted,
     userName:user.userName,
     fullName:user.fullName,
     profileImg:user.profileImg,
     createdAt:user.createdAt.toISOString()
  }
}


export function toGetPostCommentDto(cm:Comment,user:User):IGetPostCommentsDto{

  return{
    commentId:cm.id,
     postId:cm.postId??'',
     userId:cm.userId,
     text:cm.text,
     type:cm.type,
     isDeleted:cm.isDeleted,
     userName:user.userName,
     fullName:user.fullName,
     profileImg:user.profileImg,
     createdAt:getTimeAgo(cm.createdAt)
  }
}