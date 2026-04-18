import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { UserRole } from "../../../domain/enum/userEnum";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianUpdateRegistrationUseCase } from "../../interface/beautician/IbeauticianUpdateUseCase";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { toUpdateRegistrationDto } from "../../mapper/beauticianMapper";
import { IBeauticianPaymentDeatilOutput } from "../../interfaceType/beauticianType";
import { BankDetailsVO } from "../../../domain/entities/Beautician";

export class BeauticianUpdateRegistartionUseCase
  implements IBeauticianUpdateRegistrationUseCase
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

  async execute(
    userId: string,
    payment: BankDetailsVO
  ): Promise<IBeauticianPaymentDeatilOutput> {
    if (!userId || !payment) {
      throw new AppError(
        userMessages.ERROR.MISSING_PARAMETERS,
        HttpStatus.BAD_REQUEST
      );
    }
    const updatedBeautician = await this._beauticianRepo.addPaymentDetails(
      userId,
      { bankDetails: payment }
    );

    if (!updatedBeautician) {
      throw new AppError(
        userMessages.ERROR.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const updatedUser = await this._userRepo.updateRoleAndVerification(
      userId,
      UserRole.BEAUTICIAN,
      true
    );

    if (!updatedUser) {
      throw new AppError(
        "Failed to verify user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return toUpdateRegistrationDto(updatedUser);
  }
}
