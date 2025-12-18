import { VerificationStatus } from "../enum/beauticianEnum";

export type ID = string;

export interface ShopAddressVO {
  address: string;
  city: string;
  pincode: string;
}

export interface BankDetailsVO {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}



export interface Beautician {
  id: ID;
  userId: ID;

  yearsOfExperience: number;
  about: string;

  hasShop: boolean;

  shopName?: string;
  shopAddress?: ShopAddressVO;
  shopPhotos?: string[];
  shopLicence?: string[];
  portfolioImage?: string[];
  certificateImage?: string[];

  bankDetails?: BankDetailsVO;

  verificationStatus: VerificationStatus;
  verifiedBy?: ID;
  verifiedAt?: Date;

 
  homeserviceCount: number;

  createdAt: Date;
  updatedAt: Date;
}