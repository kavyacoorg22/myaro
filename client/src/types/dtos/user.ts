import type { ServiceModesType } from "../../constants/types/beautician";

export type Role = "customer" | "beautician";

export interface IUserProfile {
  userId: string;
  userName: string;
  fullName: string;
  profileImg?: string;
  isVerified: boolean;
  role: Role;
  isFollowing?: boolean;
    followingCount?: number;
  beauticianData?: {
    yearsOfExperience: number;
    about: string;
    hasShop: boolean;
    shopName?: string;
    shopAddress?: {
      address: string;
      city: string;
      pincode: string;
    };
    serviceModes: ServiceModesType[];
    homeservicecount: number;
    verificationStatus: string;
  };
}

export interface IUserDto {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: Role;
  profileImage?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: Date;
}
