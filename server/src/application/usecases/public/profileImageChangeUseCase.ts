import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IFileUploader } from "../../../domain/serviceInterface/IFileUploadService";
import { userMessages } from "../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IProfileImageChangeUseCase } from "../../interface/public/IProfileImageChangeUseCase";
import { IProfileImageChangeOutput } from "../../interfaceType/publicType";
import { toProfileImageChangeDto } from "../../mapper/userMapper";

export class ProfileImageChangeUseCase implements IProfileImageChangeUseCase {
  private _userRepo: IUserRepository;
  private _uploadService: IFileUploader;

  constructor(userRepo: IUserRepository, fileUploader: IFileUploader) {
    this._userRepo = userRepo;
    this._uploadService = fileUploader;
  }

  async execute(
    id: string,
    profileImg: Express.Multer.File
  ): Promise<IProfileImageChangeOutput> {
    const user = await this._userRepo.findByUserId(id);
    if (!user) {
      throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let profilePath: string;

    try {
      profilePath = await this._uploadService.uploadProfileImage(profileImg);
    } catch (err) {
      console.log(err);
      throw new AppError(
        "Failed to upload profile image",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const userData = await this._userRepo.updateProfileImageById(
      id,
      profilePath
    );

    if (!userData) {
      throw new AppError(
        "Failed to update user profile",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return toProfileImageChangeDto(userData);
  }
}
