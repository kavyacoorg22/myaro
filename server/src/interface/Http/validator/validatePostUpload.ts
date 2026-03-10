import { AppError } from '../../../domain/errors/appError';
import { fileMessages } from '../../../shared/constant/message/fileMessages';
import { HttpStatus } from '../../../shared/enum/httpStatus';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB
const MAX_FILES_COUNT = 10;

export const validatePostMedia = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const files = req.files as Express.Multer.File[];

  // media is optional — text/description-only posts are valid
  if (!files || files.length === 0) return next();

  if (files.length > MAX_FILES_COUNT) {
    return next(new AppError(fileMessages.ERROR.TOO_MANY_FILES, HttpStatus.BAD_REQUEST));
  }

  for (const file of files) {
    if (!ALLOWED_MEDIA_TYPES.includes(file.mimetype)) {
      return next(new AppError(fileMessages.ERROR.INVALID_TYPE_FOR_POST, HttpStatus.BAD_REQUEST));
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return next(new AppError(
        isVideo ? fileMessages.ERROR.VIDEO_TOO_LARGE : fileMessages.ERROR.FILE_TOO_LARGE,
        HttpStatus.BAD_REQUEST
      ));
    }
  }

  next();
};