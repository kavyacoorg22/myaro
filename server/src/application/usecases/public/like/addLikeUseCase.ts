import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { likeCommentMessages } from "../../../../shared/constant/message/likeCommetMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IAddLikeUSeCase } from "../../../interface/public/like/IAddLikeUSeCase";

export class AddLikeUseCase implements IAddLikeUSeCase {
  constructor(
    private _likeRepo: ILikeRepository,
    private _postRepo: IPostRepository,
  ) {}
  async execute(userId: string, postId: string): Promise<void> {
    const existingLike = await this._likeRepo.findByUserIDAndPostId(
      userId,
      postId,
    );
    if (existingLike) {
      throw new AppError(
        likeCommentMessages.ERROR.POST_ALREDY_LIKED,
        HttpStatus.CONFLICT,
      );
    }

    await this._likeRepo.create({
      userId,
      postId,
    });

    await this._postRepo.incrementLikesCount(postId);
  }
}
