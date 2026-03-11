import type { LocationVO } from "../shared/locationTagInput";

export type PostMediaType = "image" | "video" | "reel";

export interface PostUser {
  id: string;
  userName: string;
  profileImg?: string;
  isVerified?: boolean;
}
export interface PostCardData {
  id: string;
  user: { id: string; userName: string; profileImg?: string; isVerified?: boolean };
  location:LocationVO,
  mediaUrl: string | string[];   // ← now accepts array
  mediaType?: "image" | "video" | "reel";
  thumbnailUrl?: string;
  description?: string;
  likesCount?: number;
  timeAgo?: string;
  overlayLabel?: string;
}



export interface PostCardProps {
  post: PostCardData;
  onFollow?: (userId: string) => void;
  onLike?: (postId: string, liked: boolean) => void;
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
  /** Called with selected File when user picks media */
  onFileSelect?: (file: File) => void;
    onNext: (preview: string, fileType: "image" | "video") => void;  

}


export interface CropModalProps {
  isOpen: boolean;
  preview: string | null;
  fileType: "image" | "video" | null;
  onBack: () => void;
  onClose: () => void;
  /** Called when user clicks Next — passes main preview + any extra previews */
  onNext: (data: { preview: string; fileType: "image" | "video"; extras: string[] }) => void;
}
// In mediaType.ts, add:
export interface EditModalProps {
  isOpen: boolean;
  preview: string | null;
  fileType: "image" | "video" | null;
  extras?: string[];
  onBack: () => void;
  onClose: () => void;
  onNext: (data: {
    preview: string;
    fileType: "image" | "video";
    trimStart: number;
    trimEnd: number;
    soundOn: boolean;
  }) => void;
}



export type PostType = "reel" | "tips" | "rent";

export interface ShareModalProps {
  isOpen: boolean;
  mediaItems: { src: string; fileType: "image" | "video" }[];
  user: { userName: string; profileImg?: string };
  onBack: () => void;
  onClose: () => void;
  onShare: (formData: FormData) => Promise<void>;  // FormData instead of object
}

export type ShareStep = "form" | "sharing" | "posted";