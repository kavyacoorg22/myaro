import { IFileStorage } from "../../application/interface/IFileStorage";
import { IFileUploader } from "../../domain/serviceInterface/IFileUploadService";

export class FileUploadService implements IFileUploader {
  constructor(private fileStorage: IFileStorage) {}

  async uploadPortfolioImages(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map(file =>
        this.fileStorage.upload(file.buffer, file.originalname, 'beautician/portfolio')
      )
    );
  }

  async uploadCertificates(files?: Express.Multer.File[]): Promise<string[] | undefined> {
    if (!files || files.length === 0) return undefined;
    
    return Promise.all(
      files.map(file =>
        this.fileStorage.upload(file.buffer, file.originalname, 'beautician/certificates')
      )
    );
  }

  async uploadShopPhotos(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map(file =>
        this.fileStorage.upload(file.buffer, file.originalname, 'beautician/shop')
      )
    );
  }

  async uploadShopLicences(files?: Express.Multer.File[]): Promise<string[] | undefined> {
    if (!files || files.length === 0) return undefined;
    
    return Promise.all(
      files.map(file =>
        this.fileStorage.upload(file.buffer, file.originalname, 'beautician/licences')
      )
    );
  }

  async deleteFiles(paths: string[]): Promise<void> {
  for (const p of paths) {
    await this.fileStorage.delete(p);
  }
}

 async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
    throw new Error("No profile image provided");
  }

  return this.fileStorage.upload(file.buffer,file.originalname,'profile/profile-image')
 }
}
