import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { IBeauticianVerificationUseCase } from "../../interface/beautician/IbeauticianVerificationStatusUseCase";
import { IBeauticianStatusOutPut } from "../../interfaceType/beauticianType";
import { toVerificationStatusOutputDto } from "../../mapper/beauticianMapper";

export class BeauticianVerificationStatusUseCase
  implements IBeauticianVerificationUseCase
{
  private _beauticianRepo: IBeauticianRepository;
  constructor(beauticianRepo: IBeauticianRepository) {
    this._beauticianRepo = beauticianRepo;
  }

  async execute(userId: string): Promise<IBeauticianStatusOutPut> {
    const beautician = await this._beauticianRepo.findByUserId(userId);
    if (!beautician) {
      throw new AppError(userMessages.ERROR.USER_NOT_FOUND);
    }

    return toVerificationStatusOutputDto(beautician);
  }
}
