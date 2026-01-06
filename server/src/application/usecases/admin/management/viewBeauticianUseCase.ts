import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IBeauticianProfileDTO } from "../../../dtos/beautician";
import { IViewBeauticianDetailsUseCase } from "../../../interface/admin/management/IViewBeauticianDetailsUseCase";
import { toBeauticianProfileDto } from "../../../mapper/beauticianMapper";

export class ViewBeauticianDetailUseCase
  implements IViewBeauticianDetailsUseCase
{
  private _beauticianRepo: IBeauticianRepository;
  private _userRepo: IUserRepository;

  constructor(
    beauticianRepo: IBeauticianRepository,
    userRepo: IUserRepository
  ) {
    this._beauticianRepo = beauticianRepo;
    this._userRepo = userRepo;
  }

  async execute(userId: string): Promise<IBeauticianProfileDTO> {
    const beautician = await this._beauticianRepo.findByUserId(userId);

    if (!beautician) {
      throw new AppError("Beautician not found", HttpStatus.NOT_FOUND);
    }

    const user = await this._userRepo.findByUserId(beautician.userId);

    if (!user) {
      throw new AppError(
        userMessages.ERROR.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return toBeauticianProfileDto(beautician, user);
  }
}
