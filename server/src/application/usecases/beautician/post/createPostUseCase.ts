import { UserRole } from "../../../../domain/enum/userEnum";
import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { ICreatePostUSeCase } from "../../../interface/beautician/post/ICreatePostUseCase";
import { ICreatePostInput } from "../../../interfaceType/beauticianType";
import { appConfig } from "../../../../infrastructure/config/config";
import { IFileStorage } from "../../../interface/IFileStorage";
import { validateVideoFromS3 } from "../../../../interface/Http/middleware/videoValidator";

export class CreatePostUseCase implements ICreatePostUSeCase {
  constructor(
    private postRepo: IPostRepository,
    private userRepo: IUserRepository,
    private fileStorage: IFileStorage
  ) {}

  async execute(beauticianId: string, input: ICreatePostInput): Promise<void> {
    const user = await this.userRepo.findByUserId(beauticianId);
    if (!user || user.role !== UserRole.BEAUTICIAN) {
      throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

  
    const videoItems = input.media.filter((item) => item.fileType === "video");

    await Promise.all(
      videoItems.map((item) => validateVideoFromS3(item.s3Key, item.trimEnd))
    );

    const finalMediaUrls: string[] = await Promise.all(
      input.media.map(async (item) => {
        if (
          item.fileType === "video" &&
          item.trimStart !== undefined &&
          item.trimEnd !== undefined &&
          item.trimEnd > item.trimStart
        ) {
          return await this.fileStorage.trimAndReplaceVideo(
            item.s3Key,
            item.trimStart,
            item.trimEnd,
            item.soundOn ?? true
          );
        }
        return `https://${appConfig.aws.bucketName}.s3.${appConfig.aws.region}.amazonaws.com/${item.s3Key}`;
      })
    );

    await this.postRepo.create({
      beauticianId,
      description: input.description,
      postType: input.postType as any,
      media: finalMediaUrls,
      location: input.location,
      likesCount: 0,
      commentsCount: 0,
    });
  }
}