import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { ICommentRepository } from "../../../../domain/repositoryInterface/User/ICommetRepository";
import { IAddCommentUSeCase } from "../../../interface/public/comment/IaddCommentUSeCase";
import { IAddCommentInput } from "../../../interfaceType/commetLike";


 export class AddCommentUseCase implements IAddCommentUSeCase {
  constructor(
    private commentRepo: ICommentRepository,
    private postRepo: IPostRepository,           
    private beauticianRepo: IBeauticianRepository 
  ) {}

  async execute(input: IAddCommentInput): Promise<void> {

    if (input.postId) {
      const post = await this.postRepo.findById(input.postId);
      if (!post) throw new Error("Post not found");
    }

    if (input.beauticianId) {
      const beautician = await this.beauticianRepo.findByUserId(input.beauticianId);
      if (!beautician) throw new Error("Beautician not found");
    }

    await this.commentRepo.create({
      userId: input.userId,
      postId: input.postId,
      beauticianId: input.beauticianId,
      text: input.text,
      type: input.type,
      isDeleted: false,
    });

      if (input.postId) {
      await this.postRepo.incrementCommentsCount(input.postId);
    }
  }
}
