

import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IAddPaymentDetailsDto } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { UserRole } from "../../../domain/enum/userEnum";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianUpdateRegistrationUseCase } from "../../interface/beautician/IbeauticianUpdateUseCase";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { toUpdateRegistrationDto } from "../../mapper/beauticianMapper";
import { IBeauticianPaymentDeatilOutput } from "../../interfaceType/beauticianType";


export class BeauticianUpdateRegistartionUseCase implements IBeauticianUpdateRegistrationUseCase{
  private beauticianRepo: IBeauticianRepository;
  private userRepo: IUserRepository;

  constructor(
    beauticianRepo: IBeauticianRepository,
    userRepo: IUserRepository
  ) {
    this.beauticianRepo = beauticianRepo;
    this.userRepo = userRepo;
  }

  async execute( userId: string, payment: IAddPaymentDetailsDto ): Promise<IBeauticianPaymentDeatilOutput> {
    if (!userId || !payment) {
      throw new AppError(
        userMessages.ERROR.MISSING_PARAMETERS,
        HttpStatus.BAD_REQUEST
      );
    }
    const updatedBeautician = await this.beauticianRepo.addPaymentDetails(
      userId,
      payment
    );

    if (!updatedBeautician) {
      throw new AppError(
        userMessages.ERROR.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  
    const updatedUser = await this.userRepo.updateRoleAndVerification(
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

    

    return toUpdateRegistrationDto(updatedUser)
   
  }
}
