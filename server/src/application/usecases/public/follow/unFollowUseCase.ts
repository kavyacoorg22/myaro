import { IFollowRepository } from "../../../../domain/repositoryInterface/User/IFollowRepository";
import { IUnFollowBeauticianUseCase } from "../../../interface/public/follow/IUnFollowBeauticianUseCase";

export class UnFollowBeauticianUseCase implements IUnFollowBeauticianUseCase {
  constructor(private readonly _followRepo: IFollowRepository) {}

  async execute(
    userId: string,
    beauticianId: string,
  ): Promise<{ isFollowing: boolean }> {
    if (userId === beauticianId) {
      throw new Error("Invalid request.");
    }

    const isFollowing = await this._followRepo.checkFollowing(
      userId,
      beauticianId,
    );

    if (!isFollowing) {
      throw new Error("You are not following this beautician.");
    }

    await this._followRepo.unFollow(userId, beauticianId);

    return { isFollowing: false };
  }
}
