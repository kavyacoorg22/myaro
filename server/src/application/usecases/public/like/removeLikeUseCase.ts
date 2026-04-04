import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IRemoveLikeUSeCase } from "../../../interface/public/like/IRemoveLikeUseCase";

export class RemoveLikeUseCase implements IRemoveLikeUSeCase {
  constructor(
    private likeRepo: ILikeRepository,
    private postRepo: IPostRepository,
  ) {}

  async execute(userId: string, postId: string): Promise<void> {
    const existingLike = await this.likeRepo.findByUserIDAndPostId(
      userId,
      postId,
    );
    if (!existingLike) {
      throw new AppError("Like not found", HttpStatus.NOT_FOUND);
    }

    await this.likeRepo.delete(userId, postId);
    await this.postRepo.decrementLikesCount(postId);
  }
}
