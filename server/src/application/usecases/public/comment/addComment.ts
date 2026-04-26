import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { ICommentRepository } from "../../../../domain/repositoryInterface/User/ICommetRepository";
import { beauticianMessages } from "../../../../shared/constant/message/beauticianMessage";
import { likeCommentMessages } from "../../../../shared/constant/message/likeCommetMessage";
import { postMessages } from "../../../../shared/constant/message/postMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IAddCommentUSeCase } from "../../../interface/public/comment/IaddCommentUSeCase";
import { IAddCommentInput } from "../../../interfaceType/commetLike";

export class AddCommentUseCase implements IAddCommentUSeCase {
  constructor(
    private _commentRepo: ICommentRepository,
    private _postRepo: IPostRepository,
    private _beauticianRepo: IBeauticianRepository,
  ) {}

  async execute(input: IAddCommentInput): Promise<void> {
    if (!input.postId && !input.beauticianId) {
      throw new AppError(
        likeCommentMessages.ERROR.POST_OR_BEAUTICIAN_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (input.postId && input.beauticianId) {
      throw new AppError(
        likeCommentMessages.ERROR.ONLY_ONE_ALLOWED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (input.postId) {
      const post = await this._postRepo.findById(input.postId);
      if (!post)
        throw new AppError(postMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (input.beauticianId) {
      const beautician = await this._beauticianRepo.findByUserId(
        input.beauticianId,
      );
      if (!beautician)
        throw new AppError(
          beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
    }

    if (input.beauticianId) {
      if (input.rating === undefined || input.rating < 1 || input.rating > 5) {
        throw new AppError(
          likeCommentMessages.ERROR.RATING_REQUIRED,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (input.parentId) {
      const parentComment = await this._commentRepo.findById(input.parentId);

      if (!parentComment) {
        throw new AppError(
          likeCommentMessages.ERROR.PARENT_COMMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (
        (input.postId && parentComment.postId?.toString() !== input.postId) ||
        (input.beauticianId &&
          parentComment.beauticianId?.toString() !== input.beauticianId)
      ) {
        throw new AppError(
          likeCommentMessages.ERROR.INVALID_REPLY,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this._commentRepo.create({
      userId: input.userId,
      postId: input.postId,
      beauticianId: input.beauticianId,
      text: input.text,
      type: input.type,
      parentId: input.parentId ?? null,
      isDeleted: false,
      rating: input.beauticianId ? input.rating : undefined,
    });

    if (input.parentId) {
      await this._commentRepo.incrementReplyCount(input.parentId);
    }
    if (input.postId && !input.parentId) {
      await this._postRepo.incrementCommentsCount(input.postId);
    }
  }
}
