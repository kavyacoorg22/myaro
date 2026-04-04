import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ICommentRepository } from "../../../../domain/repositoryInterface/User/ICommetRepository";
import { IGetHomeServiceCommentsDto } from "../../../dtos/likeCommet";
import { IGetHomeServiceCommetsUseCase } from "../../../interface/public/comment/IgetHomeServiceCommetsUSeCase";
import { IGetHomeServiceCommentsOutPut } from "../../../interfaceType/commetLike";
import { toGetHomeServiceCommentDto } from "../../../mapper/likeCommentMapper";

export class GetHomeServiceUseCase implements IGetHomeServiceCommetsUseCase{
  constructor(private commentRepo:ICommentRepository,private userRepo:IUserRepository){}
  async execute(beauticianId: string,  limit: number = 10,
  cursor?: string|null): Promise<IGetHomeServiceCommentsOutPut> {
    
    const {comments,nextCursor}=await this.commentRepo.findHomeServiceComments(beauticianId,limit,cursor)

    const userIds=[...new Set(comments.map((u)=>u.userId))]

    const userData=await this.userRepo.findUsersByIds(userIds)

    const userMap=new Map(userData.map((u)=>[u.id,u]))


   const enrichedComments= comments.map((cm)=>{
      const user=userMap.get(cm.userId)
      
        if (!user) return null;
     return toGetHomeServiceCommentDto(cm,user)
    })
      .filter((c): c is IGetHomeServiceCommentsDto => c !== null);

    return {
      comments: enrichedComments,
      nextCursor
    };

  }
}