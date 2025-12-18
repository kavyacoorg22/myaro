

import { VerificationStatus } from "../../../../domain/enum/beauticianEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianRepository, IVerificationUpdate } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { userMessages } from "../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IApproveBeauticianUseCase } from "../../../interface/admin/management/IApproveBeauticianUseCase";
import { IResponse } from "../../../interfaceType/authtypes";

export class ApproveBeauticianUseCase implements IApproveBeauticianUseCase {
    private _beauticianRepo: IBeauticianRepository;

    constructor(beauticianRepo: IBeauticianRepository) {
        this._beauticianRepo = beauticianRepo;
    }

    async execute(input: { userId: string; adminId?: string }): Promise<IResponse> {
    const { userId, adminId } = input;

    
    if (!userId) {
      throw new AppError(userMessages.ERROR.MISSING_PARAMETERS, HttpStatus.BAD_REQUEST);
    }
 

    const beautician = await this._beauticianRepo.findByUserId(userId);
    if (!beautician) {
      throw new AppError(userMessages.ERROR.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

   
    const update: IVerificationUpdate = {
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBy :adminId,
      verifiedAt: new Date(),
    };

  
    const updated = await this._beauticianRepo.updateVerificationByUserId(userId, update);

    if (!updated) {
    
      throw new AppError(userMessages.ERROR.UPDATE_FAILED ?? "Failed to update verification", HttpStatus.INTERNAL_SERVER_ERROR);
    }

   

    return {
      success: true,
      message: generalMessages.SUCCESS.OPERATION_SUCCESS?? "Beautician verified successfully",
    
    };
  }
}