
import { VerificationStatus } from "../../../domain/enum/beauticianEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { beauticianMessages } from "../../../shared/constant/message/beauticianMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IGetReRegistrationPrefillUseCase } from "../../interface/beautician/IBeauticianReRegistationPrefillUseCase";
import { IBeauticianReRegistrationPrefilOutPut } from "../../interfaceType/beauticianType";
import { toReRegistrationPrefillDto } from "../../mapper/beauticianMapper";


export class GetReRegistrationPrefillUseCase
  implements IGetReRegistrationPrefillUseCase
{
  constructor(private _beauticianRepo: IBeauticianRepository) {}

  async execute(userId: string): Promise<IBeauticianReRegistrationPrefilOutPut> {
    const beautician = await this._beauticianRepo.findByUserId(userId);

    if (!beautician) {
      throw new AppError(beauticianMessages.ERROR.BEAUTICIAN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (beautician.verificationStatus !== VerificationStatus.REJECTED) {
      throw new AppError(
        beauticianMessages.ERROR.RE_REGISTRATION_NOT_ALLOWED,
        HttpStatus.FORBIDDEN,
      );
    }

    const data=toReRegistrationPrefillDto(beautician);
    return {data}
  }
}