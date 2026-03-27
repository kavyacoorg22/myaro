import { PostType } from "../../../../domain/enum/userEnum";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IGetBeauticianPostUSeCase } from "../../../interface/beautician/post/IGetbeauticianPostUseCase";
import { IGetBeauticianPostOutPut } from "../../../interfaceType/beauticianType";
import { toGetBeauticianPostDto, toGetFeedDto } from "../../../mapper/beauticianMapper";


export class GetBeauticianPostUseCase implements IGetBeauticianPostUSeCase{

  constructor(private postRepo:IPostRepository){}

async execute(
  beauticianId: string,
   postType: PostType = PostType.POST,  
  cursor: string | null = null,
  limit: number = 12
): Promise<IGetBeauticianPostOutPut> {
  const { posts, nextCursor } = await this.postRepo.findByBeauticianIdWithCursor(
    beauticianId,
    postType,
    cursor,
    limit
  );

  return {
    posts: posts.map(toGetBeauticianPostDto),
    nextCursor,
  };
}
}