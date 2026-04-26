import { AppError } from "../../../../../domain/errors/appError";
import { IBeauticianRepository } from "../../../../../domain/repositoryInterface/IBeauticianRepository";
import { IFileUploader } from "../../../../serviceInterface/IFileUploadService";
import { authMessages } from "../../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IDeletePamphletUseCase } from "../../../../interface/beauticianService/IDeletePamphletUseCase";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { userMessages } from "../../../../../shared/constant/message/userMessage";

export class DeletePamphletImageUseCase implements IDeletePamphletUseCase {
  private _beauticianRepo: IBeauticianRepository;
  private _fileUploader: IFileUploader;

  constructor(
    beauticianRepo: IBeauticianRepository,
    fileUploader: IFileUploader,
  ) {
    this._beauticianRepo = beauticianRepo;
    this._fileUploader = fileUploader;
  }
  async execute(id: string): Promise<void> {
    const beautician = await this._beauticianRepo.findByUserId(id);
    if (!beautician) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!beautician.pamphletUrl) {
      throw new AppError(
        serviceMessages.ERROR.PAMPHLET_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this._fileUploader.deletePamphletImage(beautician.pamphletUrl);
    } catch {
      throw new AppError(
        serviceMessages.ERROR.PAMLET_DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updated = await this._beauticianRepo.removePamphlet(id);

    if (!updated) {
      throw new AppError(
        userMessages.ERROR.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
