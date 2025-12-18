import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../domain/errors/appError";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { BeauticianFiles, IBeauticianEditProfileInput, IBeauticianRegistrationInput } from "../../../application/interfaceType/beauticianType";
import { ShopAddressVO } from "../../../domain/entities/Beautician";

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
    const files = req.files as any;
    
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
    console.log(req.body.validatedData)
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
    const bankData: any = {};

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
