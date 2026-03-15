export interface IGetSignedUploadUrlsUseCase {
  execute(
    files: { index: number; fileType: string }[]
  ): Promise<{ index: number; signedUrl: string; s3Key: string }[]>;
}