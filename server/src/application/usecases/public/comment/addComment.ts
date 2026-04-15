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

    if (!input.postId && !input.beauticianId) {
      throw new Error("Either postId or beauticianId is required");
    }

    if (input.postId && input.beauticianId) {
      throw new Error("Only one of postId or beauticianId is allowed");
    }

    if (input.postId) {
      const post = await this.postRepo.findById(input.postId);
      if (!post) throw new Error("Post not found");
    }

    if (input.beauticianId) {
      const beautician = await this.beauticianRepo.findByUserId(input.beauticianId);
      if (!beautician) throw new Error("Beautician not found");
    }

    if (input.parentId) {
      const parentComment = await this.commentRepo.findById(input.parentId);

      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      if (
        (input.postId && parentComment.postId?.toString() !== input.postId) ||
        (input.beauticianId && parentComment.beauticianId?.toString() !== input.beauticianId)
      ) {
        throw new Error("Invalid reply: mismatched parent");
      }
    }

    await this.commentRepo.create({
      userId: input.userId,
      postId: input.postId ,
      beauticianId: input.beauticianId ,
      text: input.text,
      type: input.type, 
      parentId: input.parentId??null,
      isDeleted: false,
    });
   
    if (input.parentId) {
  await this.commentRepo.incrementReplyCount(input.parentId);
}
    if (input.postId && !input.parentId) {
      await this.postRepo.incrementCommentsCount(input.postId);
    }
  }
}
