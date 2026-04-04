import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { CommentRepository } from "../../../../infrastructure/repositories/user/commetRepository";
import { IGetPostCommentsDto } from "../../../dtos/likeCommet";
import { IGetPostCommetsUseCase } from "../../../interface/public/comment/IgetPostCommentsUSeCase";
import { IGetPostCommentsOutPut } from "../../../interfaceType/commetLike";
import { toGetPostCommentDto } from "../../../mapper/likeCommentMapper";

export class GetPostCommentUSeCase implements IGetPostCommetsUseCase{
  constructor(private commentrepo:CommentRepository,private userRepo:IUserRepository ){}
  async execute(postId: string,limit:number=10,cursor?:string|null): Promise<IGetPostCommentsOutPut> {
    const {comments,nextCursor}=await this.commentrepo.findByPostId(postId,limit,cursor)
    
    const userIds=[...new Set(comments.map((u)=>u.userId))]
    const userData=await this.userRepo.findUsersByIds(userIds)
    const userMap=new Map(userData.map((u)=>[u.id,u]))
    
    const enrichedComments=comments.map((cm)=>{
       const user=userMap.get(cm.userId)
       if(!user) return null
      return toGetPostCommentDto(cm,user)
    })
    .filter((c):c is IGetPostCommentsDto=>c!==null)
      return {
      comments: enrichedComments,
      nextCursor
    };
  }
}