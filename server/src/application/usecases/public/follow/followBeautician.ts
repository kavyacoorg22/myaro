import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IFollowRepository } from "../../../../domain/repositoryInterface/User/IFollowRepository";
import { beauticianMessages } from "../../../../shared/constant/message/beauticianMessage";
import { followMessages } from "../../../../shared/constant/message/followMessage";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IFollowBeauticianUseCase } from "../../../interface/public/follow/IFollowBeauticianUseCase";

export class FollowBeauticianUseCase implements IFollowBeauticianUseCase {
  constructor(
    private readonly _followRepo: IFollowRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(userId: string, beauticianId: string): Promise<void> {
    if (userId === beauticianId) {
      throw new AppError(
        "A user cannot follow themselves.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const [follower, beautician] = await Promise.all([
      this._userRepo.findByUserId(userId),
      this._userRepo.findByUserId(beauticianId),
    ]);

    if (!follower)
      throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    if (!beautician)
      throw new AppError(
        beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    if (follower.role !== UserRole.CUSTOMER) {
      throw new AppError(
        followMessages.ERROR.ONLY_CUSTOMERS_CAN_FOLLOW,
        HttpStatus.FORBIDDEN,
      );
    }
    if (beautician.role !== UserRole.BEAUTICIAN) {
      throw new AppError(
        followMessages.ERROR.TARGET_MUST_BE_BEAUTICIAN,
        HttpStatus.BAD_REQUEST,
      );
    }

    const alreadyFollowing = await this._followRepo.checkFollowing(
      userId,
      beauticianId,
    );
    if (alreadyFollowing) {
      throw new AppError(
        followMessages.ERROR.ALREADY_FOLLOWING,
        HttpStatus.CONFLICT,
      );
    }

     await this._followRepo.create({ userId, beauticianId });
  }
}
