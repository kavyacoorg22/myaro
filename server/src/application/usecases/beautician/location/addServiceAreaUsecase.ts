import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IServiceAreaRepository } from "../../../../domain/repositoryInterface/IBeauticianServiceAreaRepository";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IAddServiceAreaUseCase } from "../../../interface/beautician/location/IaddServiceAreaUseCase";
import { IAddServiceAreaRequest } from "../../../interfaceType/beauticianType";
import { LocationVO } from "../../../../domain/entities/beauticianServiceAres";

export class AddServiceAreaUseCase implements IAddServiceAreaUseCase {
  constructor(
    private readonly _beauticianRepo: IBeauticianRepository,
    private readonly _serviceAreaRepo: IServiceAreaRepository, 
  ) {}

  async execute(
    beauticianId: string,
    input: IAddServiceAreaRequest,
  ): Promise<void> {
    const beautician = await this._beauticianRepo.findByUserId(beauticianId);
    if (!beautician) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check if service area doc exists, create if not
    const existing = await this._serviceAreaRepo.findByBeauticianId(beauticianId);

    if (!existing) {
      await this._serviceAreaRepo.create({
        beauticianId,
        serviceLocation: (input.serviceableLocation as LocationVO[]) ?? [],
        homeServiceLocation: (input.homeServiceableLocation as LocationVO[]) ?? [],
      });
    } else {
      await this._serviceAreaRepo.updateLocations(beauticianId, {
        serviceLocation: input.serviceableLocation as LocationVO[] | undefined,
        homeServiceLocation: input.homeServiceableLocation as LocationVO[] | undefined,
      });
    }
  }
}