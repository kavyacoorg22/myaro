import type { ServiceModesType } from "../../constants/types/beautician";
import type { Role } from "../dtos/user";
import type { BackendResponse } from "./api";

export interface profileResponseData {
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

export interface IProfilePhotoChangeRespnseData {
  profileImg: string;
}

export interface ISearchResult {
  beauticianId: string;
  userName: string;
  fullName: string;
  profileImg: string;
}

export interface ISearchResponseData {
  beautician: ISearchResult[];
}

export interface IRecentSearch {
  searchHistoryId: string;
  beauticianId: string;
  userName: string;
  fullName: string;
  profileImg: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ISignedUrlFile {
  index: number;
  fileType: string; // "video/mp4" | "image/jpeg" etc.
  fileSize: number; // bytes
}

export interface ISignedUrl {
  index: number;
  signedUrl: string;
  s3Key: string;
}

export interface ISignedUrlResponse {
  data: ISignedUrl[];
}

export interface IMediaInput {
  s3Key: string;
  fileType: "image" | "video";
  trimStart?: number;
  trimEnd?: number;
  soundOn?: boolean;
}

export interface ICreatePostInput {
  description?: string;
  postType: string;
  location?: object;
  media: IMediaInput[];
}
export type profileResponce = BackendResponse<profileResponseData>;
export type IProfilePhotoChangeResponse =
  BackendResponse<IProfilePhotoChangeRespnseData>;
export type ISearchResponse = BackendResponse<ISearchResponseData>;
export type IRecentSearchResponse = BackendResponse<IRecentSearch[]>;
