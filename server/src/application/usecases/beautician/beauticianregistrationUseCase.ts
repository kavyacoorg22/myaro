import { Beautician } from "../../../domain/entities/Beautician";
import { VerificationStatus } from "../../../domain/enum/beauticianEnum";
import { AppError } from "../../../domain/errors/appError";
import { IBeauticianRepository, } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { IFileUploader } from "../../../domain/serviceInterface/IFileUploadService";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IBeauticianRegisterUseCase } from "../../interface/beautician/IBeauticianRegisterUseCase";
import { IBeauticianRegistartionOutput, IBeauticianRegistrationInput } from "../../interfaceType/beauticianType";






export class BeauticianRegistrationUseCase implements IBeauticianRegisterUseCase{
  private _beauticianRepo: IBeauticianRepository;
  private _fileUploader: IFileUploader;

  constructor(beauticianRepo: IBeauticianRepository, fileUploder: IFileUploader) {
    this._beauticianRepo = beauticianRepo;
    this._fileUploader= fileUploder;
  }

  async execute(data: IBeauticianRegistrationInput): Promise<IBeauticianRegistartionOutput> {
  
    const existing = await this._beauticianRepo.findByUserId(data.userId);
    if (existing && existing.verificationStatus!==VerificationStatus.REJECTED) {
      throw new AppError('Already registered as beautician', HttpStatus.BAD_REQUEST);
    }

    const newlyUploaded: string[] = [];
     
     const tryUpload = async (uploadFn: () => Promise<string[] | undefined>):Promise<string[]> => {
      const paths = await uploadFn();
      if (paths && paths.length) newlyUploaded.push(...paths);
      return paths??[];
    };

      const portfolioPaths: string[] = [];
    let certificatePaths: string[] | undefined;
    let shopPhotosPaths: string[] | undefined;
    let shopLicencePaths: string[] | undefined;

      try {
      await tryUpload(() => this._fileUploader.uploadPortfolioImages(data.files.portfolioImage));

      if (data.files.certificateImage?.length) {
        certificatePaths = await tryUpload(() => this._fileUploader.uploadCertificates(data.files.certificateImage));
      }

      if (data.hasShop) {
        if (data.files.shopPhotos?.length) {
          shopPhotosPaths = await tryUpload(() => this._fileUploader.uploadShopPhotos(data.files.shopPhotos??[]));
        }
        if (data.files.shopLicence?.length) {
          shopLicencePaths = await tryUpload(() => this._fileUploader.uploadShopLicences(data.files.shopLicence));
        }
      }
    } catch (err) {
      
      try { await this._fileUploader.deleteFiles(newlyUploaded); } catch{}
      throw err;
    }


    

    
  const registerDto: Omit<Beautician, "id" | "createdAt" | "updatedAt"|"homeserviceCount"> = {
      userId: data.userId,
      yearsOfExperience: data.yearsOfExperience,
      about: data.about,
      hasShop: data.hasShop,
      portfolioImage: portfolioPaths,
      certificateImage: certificatePaths,
      shopName: data.shopName,
      shopAddress: data.shopAddress,
      shopPhotos: shopPhotosPaths,
      shopLicence: shopLicencePaths,
      verificationStatus: VerificationStatus.PENDING,
    };

   
     const oldFiles = existing
      ? {
          portfolio: existing.portfolioImage ?? [],
          certificate: existing.certificateImage ?? [],
          shopPhotos: existing.shopPhotos ?? [],
          shopLicence: existing.shopLicence ?? [],
        }
      : null;

  
    let beauticianId = "";
    try {
      if (!existing) {
        const created = await this._beauticianRepo.create(registerDto);
        beauticianId = created.id;
      } else {
        const updated = await this._beauticianRepo.updateByUserId(data.userId, registerDto);
        beauticianId = updated?.id??'';
      }
    } catch (dbErr) {
      try { await this._fileUploader.deleteFiles(newlyUploaded); } catch {}
      throw dbErr;
    }

    
    if (oldFiles) {
      (async () => {
        try {
          await this._fileUploader.deleteFiles(oldFiles.portfolio);
          await this._fileUploader.deleteFiles(oldFiles.certificate);
          await this._fileUploader.deleteFiles(oldFiles.shopPhotos);
          await this._fileUploader.deleteFiles(oldFiles.shopLicence);
        } catch {
        }
      })();
    }

    return {
      verificationStatus: VerificationStatus.PENDING,
      beauticianId,
    };
  }
}
