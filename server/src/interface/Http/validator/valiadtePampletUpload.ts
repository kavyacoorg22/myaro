import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../domain/errors/appError";
import { fileMessages } from "../../../shared/constant/message/fileMessages";
import { HttpStatus } from "../../../shared/enum/httpStatus";


export const validatePamphletUpload = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
        return next(new AppError(fileMessages.ERROR.IMAGE_REQUIRED, HttpStatus.BAD_REQUEST));
    }

    const ALLOWED_PAMPHLET_TYPES = [
        'image/jpeg', 
        'image/png', 
        'image/webp',
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    if (!ALLOWED_PAMPHLET_TYPES.includes(file.mimetype)) {
        return next(new AppError('Invalid file type. Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX', HttpStatus.BAD_REQUEST));
    }

    const MAX_PAMPHLET_SIZE = 10 * 1024 * 1024; // 10MB for documents
    if (file.size > MAX_PAMPHLET_SIZE) {
        return next(new AppError('File too large. Maximum size is 10MB', HttpStatus.BAD_REQUEST));
    }

    next();
};