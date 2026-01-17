import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";
import { authMessages } from "../../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IGetPamphletUseCase } from "../../../../interface/admin/management/services/IGetPamphlet";
import { IGetPamphletResponse } from "../../../../interfaceType/serviceType";
import { toGetPamphletDto } from "../../../../mapper/serviceMapper";

export class GetPamphletUseCase implements IGetPamphletUseCase{
  private _beauticianRepo:IBeauticianRepository
  constructor(beauticianRepo:IBeauticianRepository)
  {
    this._beauticianRepo=beauticianRepo
  }
  async execute(beauticianId: string): Promise<IGetPamphletResponse> {
    const beautician=await this._beauticianRepo.findByUserId(beauticianId)
   if (!beautician) {
         throw new AppError(
           authMessages.ERROR.UNAUTHORIZED,
           HttpStatus.UNAUTHORIZED
         );
       }

    return toGetPamphletDto(beautician)
  }
}