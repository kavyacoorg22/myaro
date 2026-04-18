import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IRemoveLikeUSeCase } from "../../../interface/public/like/IRemoveLikeUseCase";

export class RemoveLikeUseCase implements IRemoveLikeUSeCase {
  constructor(
    private _likeRepo: ILikeRepository,
    private _postRepo: IPostRepository,
  ) {}

  async execute(userId: string, postId: string): Promise<void> {
    const existingLike = await this._likeRepo.findByUserIDAndPostId(
      userId,
      postId,
    );
    if (!existingLike) {
      throw new AppError("Like not found", HttpStatus.NOT_FOUND);
    }

    await this._likeRepo.delete(userId, postId);
    await this._postRepo.decrementLikesCount(postId);
  }
}
