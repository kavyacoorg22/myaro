import { ShopAddressVO } from "../../domain/entities/Beautician";
import { LocationVO } from "../../domain/entities/beauticianServiceAres";
import { Slot } from "../../domain/entities/schedule";
import { VerificationStatus } from "../../domain/enum/beauticianEnum";
import { UserRole } from "../../domain/enum/userEnum";

export interface IVerificationStatusDto {
  verificationStatus: VerificationStatus;
}

export interface IBeauticianDTO {
  userId: string;
  profileImg?: string;
  userName: string;
  verificationStatus: VerificationStatus;
  yearsOfExperience: number;
  shopName?: string;
  city?: string;
}

export interface IBeauticianProfileDTO {
  userId: string;
  profileImg: string;
  userName: string;
  yearsOfExperience: number;
  shopName?: string;
  city?: string;
  about: string;
  shopAddress?: ShopAddressVO;
  portfolioImage: string[];
  shopPhotos: string[];
  certificateImage: string[];
  hasShop: boolean;
}

export interface IBankDetailsDTO {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export interface IBeauticianViewEditProfileDTO {
  profileImg?: string;
  userName: string;
  fullName: string;
  yearsOfExperience: number;
  shopName?: string;
  about: string;
  shopAddress?: Partial<ShopAddressVO>;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export interface IUpdateRegistrationDTO {
  userId: string;
  isVerified: boolean;
  role: UserRole;
}

export interface ISearchBeauticianResultDto {
  beauticianId: string;
  userName: string;
  fullName: string;
  profileImg: string;
}

export interface IGetAvailabilitySlotDto {
  slots: Slot[];
  date: Date;
}

export interface IGetServiceAreaDto {
  homeServiceLocation?: LocationVO[];
  serviceLocation?: LocationVO[];
}
