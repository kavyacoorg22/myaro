import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { ICommentRepository } from "../../../domain/repositoryInterface/User/ICommetRepository";
import { IFollowRepository } from "../../../domain/repositoryInterface/User/IFollowRepository";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IOwnProfileUseCase } from "../../interface/public/IProfileUsecase";
import { IOwnProfileOutput } from "../../interfaceType/publicType";

export class OwnProfileUseCase implements IOwnProfileUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _beauticianRepo: IBeauticianRepository,
    private _followRepo: IFollowRepository,
    private readonly _commentRepo: ICommentRepository,
  ) {}

  async execute(
    targetId: string,
    requesterId?: string,
  ): Promise<IOwnProfileOutput> {
    const user = await this._userRepo.findByUserId(targetId);

    if (!user) {
      throw new AppError(
        userMessages.ERROR.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const userDetail: IOwnProfileOutput = {
      userId: user.id.toString(),
      userName: user.userName,
      fullName: user.fullName,
      profileImg: user.profileImg,
      isVerified: user.isVerified,
      role: user.role,
    };

    if (user.role === "beautician") {
      const beautician = await this._beauticianRepo.findByUserId(targetId);
      const { avgRating, totalReviews } =
        await this._commentRepo.getRatingSummary(targetId);

      if (beautician) {
        userDetail.beauticianData = {
          yearsOfExperience: beautician.yearsOfExperience,
          about: beautician.about,
          hasShop: beautician.hasShop,
          shopName: beautician.shopName,
          shopAddress: beautician.shopAddress,
          serviceModes: beautician.serviceModes ?? [],
          homeservicecount: beautician.homeserviceCount ?? 0,
          verificationStatus: beautician.verificationStatus,
          avgRating,
          totalReviews,
        };

        const isOwnProfile = requesterId === targetId;
        if (requesterId && !isOwnProfile) {
          const requester = await this._userRepo.findByUserId(requesterId);
          if (requester?.role === "customer") {
            userDetail.isFollowing = await this._followRepo.checkFollowing(
              requesterId,
              targetId,
            );
          }
        }
      }
    }

    if (user.role === "customer" && requesterId === targetId) {
      userDetail.followingCount =
        await this._followRepo.followingCount(targetId);
    }

    return userDetail;
  }
}
