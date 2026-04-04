import type { LocationVO } from "../shared/locationTagInput";

export type PostMediaType = "image" | "video" ;

export interface PostUser {
  id: string;
  userName: string;
  profileImg?: string;
  isVerified?: boolean;
}

export interface PostCardData {
  id: string;
  user: { id: string; userName: string; profileImg?: string; isVerified?: boolean };
  location: LocationVO|null;
  mediaUrl: string | string[];
  mediaType?: "image" | "video" 
  thumbnailUrl?: string;
  description?: string;
  likesCount?: number;
  timeAgo?: string;
  isLiked:boolean;
  overlayLabel?: string;
}

export interface PostCardProps {
  post: PostCardData;
  onFollow?: (userId: string) => void;
  onLike?: (postId: string, liked: boolean) => void;
  onCommentClick?: (postId: string) => void;
    className?: string;
}

export interface PostFeedProps {
  posts: PostCardProps["post"][];
  onFollow?: (userId: string) => void;
  onLike?: (postId: string, liked: boolean) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  height?: string;
}

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (file: File) => void;
  onNext: (preview: string, fileType: "image" | "video") => void;
}

export interface CropModalProps {
  isOpen: boolean;
  preview: string | null;
  fileType: "image" | "video" | null;
  onBack: () => void;
  onClose: () => void;
  onNext?: (result: {
    preview: string;
    fileType: "image" | "video";
    extras: { src: string; fileType: "image" | "video" }[];
  }) => void;
}

// Shared type — carries src + fileType + trim points
// Used by EditModal, ShareModal, and ProfilePage shareItems state
export interface MediaItemWithTrim {
  src: string;
  fileType: "image" | "video";
  trimStart: number;
  trimEnd: number;
  soundOn: boolean;
}

export interface EditModalProps {
  isOpen: boolean;
  preview: string | null;
  fileType: "image" | "video" | null;
  extras?: { src: string; fileType: "image" | "video" }[];
  onBack: () => void;
  onClose: () => void;
  onNext: (data: {
    preview: string;
    fileType: "image" | "video";
    trimStart: number;
    trimEnd: number;
    soundOn: boolean;
    // Required — every item in original order with trim points
    allProcessed: MediaItemWithTrim[];
  }) => void;
}

export type PostType = "post" | "tips" | "rent";

export interface ShareModalProps {
  isOpen: boolean;
  // MediaItemWithTrim so trim data (trimStart/trimEnd/soundOn) reaches the upload
  mediaItems: MediaItemWithTrim[];
  user: { userName: string; profileImg?: string };
  onBack: () => void;
  onClose: () => void;
  // No-op — ShareModal handles signed URL → S3 upload → POST /api/posts internally
  onShare: () => Promise<void>;
}

export type ShareStep = "form" | "sharing" | "posted";