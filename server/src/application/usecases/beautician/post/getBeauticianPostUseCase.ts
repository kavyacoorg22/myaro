import { PostType } from "../../../../domain/enum/userEnum";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { IGetBeauticianPostUSeCase } from "../../../interface/beautician/post/IGetbeauticianPostUseCase";
import { IGetBeauticianPostOutPut } from "../../../interfaceType/beauticianType";
import { toGetBeauticianPostDto } from "../../../mapper/beauticianMapper";


export class GetBeauticianPostUseCase implements IGetBeauticianPostUSeCase{

  constructor(private _postRepo:IPostRepository,private _likeRepo:ILikeRepository){}

async execute(
  userId:string,
  beauticianId: string,
   postType: PostType = PostType.POST,  
  cursor: string | null = null,
  limit: number = 12
): Promise<IGetBeauticianPostOutPut> {
  const { posts, nextCursor } = await this._postRepo.findByBeauticianIdWithCursor(
    beauticianId,
    postType,
    cursor,
    limit
  );
  const postIds=posts.map((u)=>u.id)
  const likedPostIds = await this._likeRepo.findLikedPostIds(userId, postIds);
      const likedSet = new Set(likedPostIds);


  return {
      posts: posts.map((post) => toGetBeauticianPostDto(post, likedSet.has(post.id))),
    nextCursor,
  };
}
}