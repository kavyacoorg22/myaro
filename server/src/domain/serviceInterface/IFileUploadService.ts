export interface IFileUploader {
  uploadPortfolioImages(files: Express.Multer.File[]): Promise<string[]>;
  uploadCertificates(files?: Express.Multer.File[]): Promise<string[] | undefined>;
  uploadShopPhotos(files: Express.Multer.File[]): Promise<string[]>;
  uploadShopLicences(files?: Express.Multer.File[]): Promise<string[] | undefined>;
  deleteFiles(paths: string[]): Promise<void>;
  uploadProfileImage(file:Express.Multer.File):Promise<string>
}