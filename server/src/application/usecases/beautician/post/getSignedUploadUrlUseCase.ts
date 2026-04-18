import { IGetSignedUploadUrlsUseCase } from "../../../interface/beautician/post/IGetUploadSignedUrlUseCase";
import { IFileStorage } from "../../../interface/IFileStorage";

 
export class GetSignedUploadUrlsUseCase implements IGetSignedUploadUrlsUseCase
 {
  constructor(private _fileStorage: IFileStorage) {}
 
  async execute(
    files: { index: number; fileType: string }[]
  ): Promise<{ index: number; signedUrl: string; s3Key: string }[]> {
    return Promise.all(
      files.map(async ({ index, fileType }) => {
        const { signedUrl, s3Key } = await this._fileStorage.generateSignedUploadUrl(fileType, "posts/raw");
        return { index, signedUrl, s3Key };
      })
    );
  }
}