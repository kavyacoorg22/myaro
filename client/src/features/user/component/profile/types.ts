import type { UserRoleType } from "../../../../constants/types/User";

export type ViewMode = 'own-beautician' | 'own-customer' | 'view-beautician'|'view-customer';

export interface ProfileData {
  userName?: string;
  fullName?: string;
  about?: string;
  address?: string;
  homeServiceCount?: number;
  followingCount?: number;
  profileImg?: string;
  hideButtons?: boolean;
  shopName?:string,
  yearsOfExperience?:number,
  shopAddress?:string,
  shopCity?:string,
  isVerified?:boolean
  role?:UserRoleType| undefined,
  isFollowing?:boolean
  avgRating?: number;
  totalReviews?: number;

}

export interface ProfileActions {
  onEditProfile?: () => void;
  onCalender?: () => void;
  onRegisterAsBeautician?: () => void;
  onServicePage?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  onBookService?: () => void;
  onUpload?: () => void;
  onPosts?: () => void;
  onTips?: () => void;
  onRent?: () => void;
  onFollowingClick?:()=>void
}