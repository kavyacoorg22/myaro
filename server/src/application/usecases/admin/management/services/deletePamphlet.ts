import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";
import { IFileUploader } from "../../../../../domain/serviceInterface/IFileUploadService";
import { authMessages } from "../../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IDeletePamphletUseCase } from "../../../../interface/admin/management/services/IDeletePamphletUseCase";

export class DeletePamphletImageUseCase implements IDeletePamphletUseCase {
  private _beauticianRepo: IBeauticianRepository;
  private _fileUploader: IFileUploader;

  constructor(
    beauticianRepo: IBeauticianRepository,
    fileUploader: IFileUploader
  ) {
    this._beauticianRepo = beauticianRepo;
    this._fileUploader = fileUploader;
  }
  async execute(id: string): Promise<void> {
    const beautician = await this._beauticianRepo.findByUserId(id);
    if (!beautician) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!beautician.pamphletUrl) {
      throw new AppError("Pamphlet image not found", HttpStatus.BAD_REQUEST);
    }

    try {
      await this._fileUploader.deletePamphletImage(beautician.pamphletUrl);
    } catch {
      throw new AppError(
        "Failed to delete pamphlet image",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const updated = await this._beauticianRepo.updateByUserId(id, {
      pamphletUrl: undefined,
    });

    if (!updated) {
      throw new AppError(
        "Failed to update beautician data",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
