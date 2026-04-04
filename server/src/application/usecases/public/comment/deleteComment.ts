import { CommentType } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { ICommentRepository } from "../../../../domain/repositoryInterface/User/ICommetRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IdeleteCommentUseCase } from "../../../interface/public/comment/IdeleteCommentUSeCase";

export class DeleteCommentUseCase implements IdeleteCommentUseCase {
  constructor(
    private commentRepo: ICommentRepository,
    private postRepo: IPostRepository,
  ) {}
  async execute(
    userId: string,
    commentId: string,
    postId: string | null,
  ): Promise<void> {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment) {
      throw new AppError("Comment not exists", HttpStatus.NOT_FOUND);
    }

    const isCommentOwner = userId === comment.userId;
    let isPostOwner = false;
    if (postId !== null && comment.type !== CommentType.HOME) {
      const post = await this.postRepo.findById(postId);

      if (post && post.beauticianId === userId) {
        isPostOwner = true;
      }
    }

    if (!isCommentOwner && !isPostOwner) {
      throw new AppError(generalMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
    await this.commentRepo.delete(commentId);

    if (postId) {
      await this.postRepo.decrementCommentsCount(postId);
    }
  }
     
}
