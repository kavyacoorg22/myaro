import { AppError } from '../../../domain/errors/appError';
import { fileMessages } from '../../../shared/constant/message/fileMessages';
import { HttpStatus } from '../../../shared/enum/httpStatus';
import { Request, Response, NextFunction } from 'express';

export const validateBeauticianFiles = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const files = req.files as {
    portfolioImage?: Express.Multer.File[];
    certificateImage?: Express.Multer.File[];
    shopPhotos?: Express.Multer.File[];
    shopLicence?: Express.Multer.File[];
  };

  const hasShop = req.body.hasShop === 'true';


  if (!files?.portfolioImage || files.portfolioImage.length < 3) {
    return next(
      new AppError('At least 3 portfolio images required', HttpStatus.BAD_REQUEST)
    );
  }

  if (hasShop && (!files?.shopPhotos || files.shopPhotos.length < 3)) {
    return next(
      new AppError('At least 3 shop photos required', HttpStatus.BAD_REQUEST)
    );
  }

  // Validate file types and sizes
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedDocTypes = [...allowedImageTypes, 'application/pdf'];
  const MAX_SIZE = 5 * 1024 * 1024;

  for (const [field, fileArray] of Object.entries(files)) {
    const allowedTypes = ['certificateImage', 'shopLicence'].includes(field)
      ? allowedDocTypes
      : allowedImageTypes;

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.mimetype)) {
        return next(
          new AppError(`Invalid file type for ${field}`, HttpStatus.BAD_REQUEST)
        );
      }

      if (file.size > MAX_SIZE) {
        return next(
          new AppError('File size exceeds 5MB', HttpStatus.BAD_REQUEST)
        );
      }
    }
  }

  next();
};
