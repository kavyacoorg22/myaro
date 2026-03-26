import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IOwnProfileUseCase } from "../../interface/public/IProfileUsecase";
import { IOwnProfileOutput } from "../../interfaceType/publicType";

export class OwnProfileUseCase implements IOwnProfileUseCase {
  private _userRepo: IUserRepository;
  private _beauticianRepo: IBeauticianRepository;

  constructor(
    userRepo: IUserRepository,
    beauticianRepo: IBeauticianRepository
  ) {
    this._userRepo = userRepo;
    this._beauticianRepo = beauticianRepo;
  }

  async execute(id: string): Promise<IOwnProfileOutput> {
    console.log("🔍 OwnProfileUseCase - Fetching profile for userId:", id);

    const user = await this._userRepo.findByUserId(id);

    if (!user) {
      throw new AppError(
        userMessages.ERROR.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND
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

      const beautician = await this._beauticianRepo.findByUserId(id);

      if (beautician) {

        userDetail.beauticianData = {
          yearsOfExperience: beautician.yearsOfExperience,
          about: beautician.about,
          hasShop: beautician.hasShop,
          shopName: beautician.shopName,
          shopAddress: beautician.shopAddress,
          serviceModes:beautician.serviceModes??[],
          homeservicecount: beautician.homeserviceCount ?? 0,
          verificationStatus: beautician.verificationStatus,
        };
      } else {
        console.log("⚠️ No beautician data found for this user");
      }
    }

    console.log("✅ Profile fetched successfully");
    console.log(`backend user detail ${userDetail}`);
    return userDetail;
  }
}
