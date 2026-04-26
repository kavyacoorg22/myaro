import { AppError } from "../../../../domain/errors/appError";
import { IFollowRepository } from "../../../../domain/repositoryInterface/User/IFollowRepository";
import { followMessages } from "../../../../shared/constant/message/followMessage";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IUnFollowBeauticianUseCase } from "../../../interface/public/follow/IUnFollowBeauticianUseCase";

export class UnFollowBeauticianUseCase implements IUnFollowBeauticianUseCase {
  constructor(private readonly _followRepo: IFollowRepository) {}

  async execute(
    userId: string,
    beauticianId: string,
  ): Promise<{ isFollowing: boolean }> {
    if (userId === beauticianId) {
      throw new AppError(
        generalMessages.ERROR.INVALID_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isFollowing = await this._followRepo.checkFollowing(
      userId,
      beauticianId,
    );

    if (!isFollowing) {
      throw new AppError(
        followMessages.ERROR.NOT_FOLLOWING,
        HttpStatus.CONFLICT,
      );
    }

    await this._followRepo.unFollow(userId, beauticianId);

    return { isFollowing: false };
  }
}
