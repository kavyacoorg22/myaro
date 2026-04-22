import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IFollowRepository } from "../../../../domain/repositoryInterface/User/IFollowRepository";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IFollowBeauticianUseCase } from "../../../interface/public/follow/IFollowBeauticianUseCase";

export class FollowBeauticianUseCase implements IFollowBeauticianUseCase {
  constructor(
    private readonly _followRepo: IFollowRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

 async execute(userId: string, beauticianId: string): Promise<void> {
  console.log('reaching follow beacutician usecase')
    if (userId === beauticianId) {
      throw new AppError("A user cannot follow themselves.", HttpStatus.BAD_REQUEST);
    }

    const [follower, beautician] = await Promise.all([
      this._userRepo.findByUserId(userId),
      this._userRepo.findByUserId(beauticianId),
    ]);
   console.log('follower:::::::',follower)
      console.log('beautician:::::::',beautician)

    if (!follower) throw new AppError("User not found.", HttpStatus.NOT_FOUND);
    if (!beautician) throw new AppError("Beautician not found.", HttpStatus.NOT_FOUND);

    if (follower.role !== UserRole.CUSTOMER) {
      throw new AppError("Only customers can follow beauticians.", HttpStatus.FORBIDDEN);
    }
    if (beautician.role !== UserRole.BEAUTICIAN) {
      throw new AppError("You can only follow beauticians.", HttpStatus.BAD_REQUEST);
    }

    const alreadyFollowing = await this._followRepo.checkFollowing(userId, beauticianId);
    if (alreadyFollowing) {
      throw new AppError("Already following.", HttpStatus.CONFLICT);
    }
    console.log('reached end of the usecase')
    const data=await this._followRepo.create({ userId, beauticianId });
    console.log(data)
  }
}
