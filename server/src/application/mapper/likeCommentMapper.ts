import { Comment } from "../../domain/entities/comment";
import { User } from "../../domain/entities/User";
import { IGetHomeServiceCommentsDto, IGetPostCommentsDto } from "../dtos/likeCommet";


export function toGetHomeServiceCommentDto(cm:Comment,user:User):IGetHomeServiceCommentsDto{

  return{
     beauticianId:cm.beauticianId??'',
     userId:cm.userId,
     text:cm.text,
     type:cm.type,
     isDeleted:cm.isDeleted,
     userName:user.userName,
     fullName:user.fullName,
     createdAt:user.createdAt.toISOString()
  }
}


export function toGetPostCommentDto(cm:Comment,user:User):IGetPostCommentsDto{

  return{
     postId:cm.postId??'',
     userId:cm.userId,
     text:cm.text,
     type:cm.type,
     isDeleted:cm.isDeleted,
     userName:user.userName,
     fullName:user.fullName,
     createdAt:user.createdAt.toISOString()
  }
}