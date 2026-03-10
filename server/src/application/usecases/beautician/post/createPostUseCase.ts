import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IFileUploader } from "../../../../domain/serviceInterface/IFileUploadService";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { ICreatePostUSeCase } from "../../../interface/beautician/post/ICreatePostUseCase";
import { ICreatePostInput } from "../../../interfaceType/beauticianType";

export class CreatePostUseCase implements ICreatePostUSeCase {
  constructor(
    private postRepo: IPostRepository,
    private userRepo: IUserRepository,
    private fileUploader: IFileUploader  
  ) {}

  async execute(beauticianId: string, input: ICreatePostInput, files: Express.Multer.File[]): Promise<void> {
    const user = await this.userRepo.findByUserId(beauticianId);

      console.log('files received:', files.length);           // is multer passing files?
  console.log('file buffers:', files.map(f => f.buffer?.length));
    if (!user || user.role !== UserRole.BEAUTICIAN) {
      throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    // upload to AWS, get back real URLs
    const mediaUrls = files.length > 0
      ? await this.fileUploader.uploadPostMedia(files)
      : [];

    await this.postRepo.create({
      beauticianId,
      description: input.description,
      postType: input.postType,
      media: mediaUrls,   
      location: input.location,
      likesCount: 0,
      commentsCount: 0,
    });
  }
}