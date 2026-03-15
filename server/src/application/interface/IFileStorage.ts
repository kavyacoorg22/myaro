export interface IFileStorage {
  upload(fileBuffer: Buffer, filename: string, folder: string): Promise<string>;
  uploadFromUrl(url: string, filename: string, folder: string): Promise<string>;
  delete(path: string): Promise<void>;
  generateSignedUploadUrl(
    fileType: string,
    folder: string,
  ): Promise<{ signedUrl: string; s3Key: string }>;
  trimAndReplaceVideo(
    rawS3Key: string,
    trimStart: number,
    trimEnd: number,
    soundOn: boolean,
  ): Promise<string>;
}
