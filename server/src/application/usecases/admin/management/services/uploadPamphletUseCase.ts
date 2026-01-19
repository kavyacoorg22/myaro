import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IFileUploader } from "../../../../../domain/serviceInterface/IFileUploadService";
import { authMessages } from "../../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IUploadPamphletUseCase } from "../../../../interface/beauticianService/IPamphletUploadUseCase";

export class UploadPamphletUseCase implements IUploadPamphletUseCase {
  private _beauticianRepo: IBeauticianRepository;
  private _uploadService: IFileUploader;
  constructor(
    beauticianRepo: IBeauticianRepository,
    fileUploadService: IFileUploader,
  ) {
    this._beauticianRepo = beauticianRepo;
    this._uploadService = fileUploadService;
  }
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
      pamphletUrl = await this._uploadService.uploadPamphletImage(pamphletImg);
    } catch (err) {
      throw new AppError(
        "Failed to upload pamphlet image",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const beauticianData = await this._beauticianRepo.updateByUserId(id, {
      pamphletUrl,
    });
    if (!beauticianData) {
      throw new AppError(
        "Failed to update beautician data",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
