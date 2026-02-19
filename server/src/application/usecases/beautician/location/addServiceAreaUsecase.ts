import { Beautician } from "../../../../domain/entities/Beautician";
import { AppError } from "../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IAddServiceAreaUseCase } from "../../../interface/beautician/location/IaddServiceAreaUseCase";
import { IAddServiceAreaRequest } from "../../../interfaceType/beauticianType";

export class AddServiceAreaUseCase implements IAddServiceAreaUseCase {
  constructor(private readonly beauticianRepo: IBeauticianRepository) {}

  async execute(
    beauticianId: string,
    input: IAddServiceAreaRequest,
  ): Promise<void> {
    const beautician = await this.beauticianRepo.findByUserId(beauticianId);
    if (!beautician) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updateData: Partial<
      Omit<Beautician, "id" | "createdAt" | "updatedAt" | "homeServiceCount">
    > = {};

    const normalizeArray = (arr?: string[]) =>
      arr ? [...new Set(arr.map((v) => v.trim()))] : undefined;

    if (input.homeServiceableLocation) {
      updateData.homeServiceableLocation = normalizeArray(
        input.homeServiceableLocation,
      );
    }

    if (input.serviceableLocation) {
      updateData.serviceableLocation = normalizeArray(input.serviceableLocation);
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    await this.beauticianRepo.updateByUserId(beauticianId, updateData);
  }
}
