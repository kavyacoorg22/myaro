import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { BeauticianFiles, IBeauticianEditProfileInput, IBeauticianRegistrationInput } from "../../../application/interfaceType/beauticianType";
import { ShopAddressVO } from "../../../domain/entities/Beautician";
import { PostType } from "../../../domain/enum/userEnum";
import { fileMessages } from "../../../shared/constant/message/fileMessages";

export const validateBeauticianData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const {
  
      yearsOfExperience,
      about,
      hasShop,
      shopName,
      shopAddress,
      shopCity,
      shopPincode,
    } = req.body;

  
  
    if (!yearsOfExperience || isNaN(Number(yearsOfExperience))) {
      throw new AppError("Invalid years of experience", HttpStatus.BAD_REQUEST);
    }

    const yearsNum = Number(yearsOfExperience);
    if (yearsNum < 0) {
      throw new AppError("Years of experience cannot be negative", HttpStatus.BAD_REQUEST);
    }

    if (!about || about.trim().length < 10) {
      throw new AppError(
        "About must be at least 10 characters long",
        HttpStatus.BAD_REQUEST
      );
    }

    
    const hasShopBoolean =
      hasShop === "true" || hasShop === true || hasShop === "1";

    if (hasShopBoolean) {
      if (!shopName || shopName.trim().length < 2) {
        throw new AppError("shopName is required when hasShop = true", HttpStatus.BAD_REQUEST);
      }
      if (!shopAddress || !shopCity || !shopPincode) {
        throw new AppError(
          "shopAddress, shopCity, and shopPincode are required when hasShop = true",
          HttpStatus.BAD_REQUEST
        );
      }
    }
type MulterFiles = {
  portfolioImage?: Express.Multer.File[];
  certificateImage?: Express.Multer.File[];
  shopPhotos?: Express.Multer.File[];
  shopLicence?: Express.Multer.File[];
};

const files = req.files as MulterFiles;
    
      const beauticianFiles: BeauticianFiles = {
      portfolioImage: files?.portfolioImage ?? [],
      certificateImage: files?.certificateImage,
      shopPhotos: files?.shopPhotos,
      shopLicence: files?.shopLicence,
    };
    

      const shopAddressVO: ShopAddressVO | undefined = hasShopBoolean
      ? {
          address: String(shopAddress),
          city: String(shopCity),
          pincode: String(shopPincode),
        }
      : undefined;

const normalized: Partial<IBeauticianRegistrationInput>= {
      yearsOfExperience: yearsNum,
      about: String(about).trim(),
      hasShop: hasShopBoolean,
      shopName: shopName?.trim(),
      shopAddress: shopAddressVO,
      files: beauticianFiles,
    };
    req.body.validatedData = normalized
    next()

  } catch (err) {
    next(err);
  }
};

export const validatePaymentDetails = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const {
      accountHolderName,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
      bankName,
      upiId,
    } = req.body;

    
    if (!accountHolderName || !accountNumber || !confirmAccountNumber || !ifscCode || !bankName ) {
      throw new AppError(
        "All payment details are required",
        HttpStatus.BAD_REQUEST
      );
    }

  
    if (typeof accountHolderName !== "string" || accountHolderName.trim().length < 2) {
      throw new AppError(
        "Account holder name must be at least 2 characters long",
        HttpStatus.BAD_REQUEST
      );
    }

    if (!/^[a-zA-Z\s]+$/.test(accountHolderName.trim())) {
      throw new AppError(
        "Account holder name must contain only letters and spaces",
        HttpStatus.BAD_REQUEST
      );
    }

   
    if (typeof accountNumber !== "string" || !/^\d{9,18}$/.test(accountNumber.trim())) {
      throw new AppError(
        "Account number must be between 9 and 18 digits",
        HttpStatus.BAD_REQUEST
      );
    }

  
    if (typeof confirmAccountNumber !== "string" || confirmAccountNumber.trim() !== accountNumber.trim()) {
      throw new AppError(
        "Account numbers do not match",
        HttpStatus.BAD_REQUEST
      );
    }

   
    if (typeof ifscCode !== "string" || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase())) {
      throw new AppError(
        "Invalid IFSC code format (e.g., SBIN0001234)",
        HttpStatus.BAD_REQUEST
      );
    }

 
    if (typeof bankName !== "string" || bankName.trim().length < 2) {
      throw new AppError(
        "Bank name must be at least 2 characters long",
        HttpStatus.BAD_REQUEST
      );
    }

  
    if (upiId&&( typeof upiId !== "string" || !/^[\w.-]+@[\w.-]+$/.test(upiId.trim()))) {
      throw new AppError(
        "Invalid UPI ID format (e.g., username@bank)",
        HttpStatus.BAD_REQUEST
      );
    }

    
    req.body = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName.trim(),
      upiId: upiId ? upiId.trim().toLowerCase() : undefined,

    };

    next();
  } catch (error) {
    next(error);
  }
};




export const validateEditBeauticianProfile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const {
      userName,
      fullName,
      about,
      shopName,
      shopAddress,
      yearsOfExperience,
      accountHolderName,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
      bankName,
      upiId
    } = req.body;

    const validated: Partial<IBeauticianEditProfileInput> = {};

  
    if (userName !== undefined) {
      if (typeof userName !== "string" || userName.trim().length < 2) {
        throw new AppError("Invalid userName", HttpStatus.BAD_REQUEST);
      }
      validated.userName = userName.trim();
    }

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || fullName.trim().length < 2) {
        throw new AppError("Invalid fullName", HttpStatus.BAD_REQUEST);
      }
      validated.fullName = fullName.trim();
    }

    if (about !== undefined) {
      if (typeof about !== "string" || about.trim().length < 10) {
        throw new AppError("About must be at least 10 characters", HttpStatus.BAD_REQUEST);
      }
      validated.about = about.trim();
    }

    if (shopName !== undefined) {
      if (typeof shopName !== "string" || shopName.trim().length < 2) {
        throw new AppError("Invalid shopName", HttpStatus.BAD_REQUEST);
      }
      validated.shopName = shopName.trim();
    }

    if (shopAddress !== undefined) {
      if (typeof shopAddress !== "object") {
        throw new AppError("shopAddress must be an object", HttpStatus.BAD_REQUEST);
      }
      validated.shopAddress = {
        address: shopAddress.address?.trim(),
        city: shopAddress.city?.trim(),
        pincode: shopAddress.pincode?.trim(),
      };
    }
    if (yearsOfExperience !== undefined) {
      if (isNaN(Number(yearsOfExperience)) || Number(yearsOfExperience) < 0) {
        throw new AppError("Invalid yearsOfExperience", HttpStatus.BAD_REQUEST);
      }
      validated.yearsOfExperience = Number(yearsOfExperience);
    }

    
    // BANK DETAILS 
   const bankData: Partial<IBeauticianEditProfileInput> = {};

    if (accountHolderName !== undefined) {
      if (typeof accountHolderName !== "string" || accountHolderName.trim().length < 2) {
        throw new AppError("Invalid accountHolderName", HttpStatus.BAD_REQUEST);
      }
      bankData.accountHolderName = accountHolderName.trim();
    }

    if (accountNumber !== undefined) {
      if (!/^\d{9,18}$/.test(String(accountNumber).trim())) {
        throw new AppError("accountNumber must be 9–18 digits", HttpStatus.BAD_REQUEST);
      }
      bankData.accountNumber = String(accountNumber).trim();

     
      if (
        confirmAccountNumber === undefined ||
        String(confirmAccountNumber).trim() !== String(accountNumber).trim()
      ) {
        throw new AppError(
          "confirmAccountNumber must match accountNumber",
          HttpStatus.BAD_REQUEST
        );
      }
    }

   
    if (confirmAccountNumber !== undefined && accountNumber === undefined) {
      throw new AppError(
        "confirmAccountNumber cannot be sent without accountNumber",
        HttpStatus.BAD_REQUEST
      );
    }

    if (ifscCode !== undefined) {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(String(ifscCode).trim())) {
        throw new AppError("Invalid IFSC code format", HttpStatus.BAD_REQUEST);
      }
      bankData.ifscCode = String(ifscCode).trim().toUpperCase();
    }

    if (bankName !== undefined) {
      if (typeof bankName !== "string" || bankName.trim().length < 2) {
        throw new AppError("Invalid bankName", HttpStatus.BAD_REQUEST);
      }
      bankData.bankName = bankName.trim();
    }

    if (upiId !== undefined) {
      if (!/^[\w.-]+@[\w.-]+$/.test(String(upiId).trim())) {
        throw new AppError("Invalid UPI ID format", HttpStatus.BAD_REQUEST);
      }
      bankData.upiId = String(upiId).trim().toLowerCase();
    }

  Object.assign(validated, bankData);

    req.body.validatedData = validated;
    next();

  } catch (error) {
    next(error);
  }
};



export function validateAddCustomServiceInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { category, service } = req.body;

  if (!category || typeof category !== "object") {
    return res.status(400).json({
      error: "Category is required",
    });
  }

  if (!category.categoryId && !category.name) {
    return res.status(400).json({
      error: "Either categoryId or category name is required",
    });
  }

  if (category.name && typeof category.name !== "string") {
    return res.status(400).json({
      error: "Category name must be a string",
    });
  }

  if (!service || typeof service !== "object") {
    return res.status(400).json({
      error: "Service details are required",
    });
  }

  if (!service.name || typeof service.name !== "string") {
    return res.status(400).json({
      error: "Service name is required and must be a string",
    });
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(service.name)) {
    return res.status(400).json({
      error: "Service name must contain only letters and spaces",
    });
  }

  if (
    service.price === undefined ||
    typeof service.price !== "number" ||
    service.price <= 0
  ) {
    return res.status(400).json({
      error: "Service price must be a number greater than 0",
    });
  }

  if (typeof service.isHomeServiceAvailable !== "boolean") {
    return res.status(400).json({
      error: "isHomeServiceAvailable must be a boolean",
    });
  }

  next();
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
 
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;  // 200 MB — raw video before trim
const MAX_FILES_COUNT = 10;
 
export const validateSignedUrlRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { files } = req.body as { files: { index: number; fileType: string; fileSize: number }[] };
 
  if (!Array.isArray(files) || files.length === 0) {
    return next(new AppError("files array is required", HttpStatus.BAD_REQUEST));
  }
  if (files.length > MAX_FILES_COUNT) {
    return next(new AppError(fileMessages.ERROR.TOO_MANY_FILES, HttpStatus.BAD_REQUEST));
  }
 
  for (const file of files) {
    if (!file.fileType || !ALLOWED_MEDIA_TYPES.includes(file.fileType)) {
      return next(new AppError(fileMessages.ERROR.INVALID_TYPE_FOR_POST, HttpStatus.BAD_REQUEST));
    }
 
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.fileType);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
 
    // fileSize must be a positive number within the allowed limit
    if (typeof file.fileSize !== "number" || file.fileSize <= 0) {
      return next(new AppError("fileSize must be a positive number", HttpStatus.BAD_REQUEST));
    }
    if (file.fileSize > maxSize) {
      return next(new AppError(
        isVideo ? fileMessages.ERROR.VIDEO_TOO_LARGE : fileMessages.ERROR.FILE_TOO_LARGE,
        HttpStatus.BAD_REQUEST
      ));
    }
  }
 
  next();
};
 
const MAX_VIDEO_DURATION_SECONDS = 180;
const MIN_VIDEO_DURATION_SECONDS = 1;
 
export const validateCreatePostInput = (req: Request, res: Response, next: NextFunction): void => {
  const { description, postType, location, media } = req.body;
 
  if (!Array.isArray(media) || media.length === 0) {
    res.status(400).json({ error: "media array is required" }); return;
  }
 
  for (const item of media) {
    if (!item.s3Key || typeof item.s3Key !== "string") {
      res.status(400).json({ error: "Each media item must have a valid s3Key" }); return;
    }
    if (!["image", "video"].includes(item.fileType)) {
      res.status(400).json({ error: "fileType must be 'image' or 'video'" }); return;
    }
 
    if (item.fileType === "video") {
      const { trimStart, trimEnd } = item;
      if (trimStart === undefined || trimEnd === undefined) {
        res.status(400).json({ error: "Videos must include trimStart and trimEnd" }); return;
      }
      if (typeof trimStart !== "number" || typeof trimEnd !== "number") {
        res.status(400).json({ error: "trimStart and trimEnd must be numbers" }); return;
      }
      if (trimStart < 0) {
        res.status(400).json({ error: "trimStart cannot be negative" }); return;
      }
      if (trimEnd <= trimStart) {
        res.status(400).json({ error: "trimEnd must be greater than trimStart" }); return;
      }
      const duration = trimEnd - trimStart;
      if (duration < MIN_VIDEO_DURATION_SECONDS) {
        res.status(400).json({ error: `Video must be at least ${MIN_VIDEO_DURATION_SECONDS}s after trimming` }); return;
      }
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        res.status(400).json({ error: `Video cannot exceed ${MAX_VIDEO_DURATION_SECONDS}s after trimming` }); return;
      }
    }
  }
 
  if (description !== undefined) {
    if (typeof description !== "string" || description.trim().length === 0) {
      res.status(400).json({ error: "Description cannot be empty" }); return;
    }
    if (description.length > 2200) {
      res.status(400).json({ error: "Description cannot exceed 2200 characters" }); return;
    }
  }
 
  if (!postType) {
    res.status(400).json({ error: "Post type is required" }); return;
  }
  if (!Object.values(PostType).includes(postType)) {
    res.status(400).json({ error: `Invalid post type. Must be one of: ${Object.values(PostType).join(", ")}` }); return;
  }
 
  if (location !== undefined) {
    let parsed = location;
    if (typeof location === "string") {
      try { parsed = JSON.parse(location); }
      catch { res.status(400).json({ error: "Location must be valid JSON" }); return; }
    }
    if (typeof parsed !== "object") { res.status(400).json({ error: "Location must be an object" }); return; }
    if (parsed.lat === undefined || parsed.lng === undefined) { res.status(400).json({ error: "Location must include lat and lng" }); return; }
    if (typeof parsed.lat !== "number" || parsed.lat < -90 || parsed.lat > 90) { res.status(400).json({ error: "lat must be between -90 and 90" }); return; }
    if (typeof parsed.lng !== "number" || parsed.lng < -180 || parsed.lng > 180) { res.status(400).json({ error: "lng must be between -180 and 180" }); return; }
    req.body.location = parsed;
  }
 
  next();
};
 