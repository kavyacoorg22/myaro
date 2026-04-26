import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";
import { IFileUploader } from "../../../../serviceInterface/IFileUploadService";
import { authMessages } from "../../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUploadPamphletUseCase } from "../../../../interface/beauticianService/IPamphletUploadUseCase";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { userMessages } from "../../../../../shared/constant/message/userMessage";
import logger from "../../../../../utils/logger";

export class UploadPamphletUseCase implements IUploadPamphletUseCase {
  constructor(
    private _beauticianRepo: IBeauticianRepository,
    private _uploadService: IFileUploader,
  ) {}
  async execute(id: string, pamphletImg: Express.Multer.File): Promise<void> {
    const beautician = await this._beauticianRepo.findByUserId(id);
    if (!beautician) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    let pamphletUrl: string;
    try {
      if (beautician.pamphletUrl) {
        try {
          await this._uploadService.deletePamphletImage(beautician.pamphletUrl);
        } catch (err) {
              logger.warn("Failed to delete old pamphlet image", { err });

        }
      }
      pamphletUrl = await this._uploadService.uploadPamphletImage(pamphletImg);
    } catch (err) {
      throw new AppError(
        err instanceof Error
          ? err.message
          : serviceMessages.ERROR.PAMPHLET_UPLOAD_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const beauticianData = await this._beauticianRepo.updateByUserId(id, {
      pamphletUrl,
    });
    if (!beauticianData) {
      throw new AppError(
        userMessages.ERROR.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
