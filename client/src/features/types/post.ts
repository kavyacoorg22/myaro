import type { LocationVO } from "../shared/locationTagInput";
import type { PostType } from "./mediaType";

export interface Post {
  _id: string;
  mediaItems: { src: string; fileType: "image" | "video" }[];
  caption?: string;
  createdAt: string;
}
 
export interface PostsTabProps {
  beauticianUserId?: string | null;
  postType?: PostType;
}


export interface BeauticianPostData {
  id: string;
  description?: string;
  postType: PostType;
  location?: LocationVO | null;
  media: string[];
  likesCount?: number;
  commentsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  timeAgo?: string;
}