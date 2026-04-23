import { CommentType } from "../../domain/enum/userEnum";
import {
  IGetHomeServiceCommentsDto,
  IGetLikedUserListDto,
  IGetPostCommentsDto,
  IGetReplyDto,
} from "../dtos/likeCommet";

export interface IAddCommentInput {
  userId: string;
  postId?: string;
  beauticianId?: string;
  text: string;
  type: CommentType;
  parentId?: string;
  rating?: number;
}

export interface IGetPostCommentsOutPut {
  comments: IGetPostCommentsDto[];
  nextCursor: string | null;
}

export interface IGetHomeServiceCommentsOutPut {
  comments: IGetHomeServiceCommentsDto[];
  nextCursor: string | null;
  avgRating: number;
  totalReviews: number;
}

export interface IGetRepliesOutput {
  replies: IGetReplyDto[];
  nextCursor: string | null;
}

export interface IGetLikedUserListResponse {
  data: IGetLikedUserListDto[];
  nextCursor: string | null;
}
