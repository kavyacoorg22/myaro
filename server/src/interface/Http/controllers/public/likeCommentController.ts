import { Request, Response } from "express";
import { IAddCommentUSeCase } from "../../../../application/interface/public/comment/IaddCommentUSeCase";
import { IdeleteCommentUseCase } from "../../../../application/interface/public/comment/IdeleteCommentUSeCase";
import { IGetHomeServiceCommetsUseCase } from "../../../../application/interface/public/comment/IgetHomeServiceCommetsUSeCase";
import { IGetPostCommetsUseCase } from "../../../../application/interface/public/comment/IgetPostCommentsUSeCase";
import { IAddLikeUSeCase } from "../../../../application/interface/public/like/IAddLikeUSeCase";
import { IRemoveLikeUSeCase } from "../../../../application/interface/public/like/IRemoveLikeUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { IAddCommentInput } from "../../../../application/interfaceType/commetLike";
import { CommentType } from "../../../../domain/enum/userEnum";
import { IGetRepliesUseCase } from "../../../../application/interface/public/comment/IgetReplyCommentUSeCase";
import { IGetLikedUserListUseCase } from "../../../../application/interface/public/like/IGetLikedUserList";
import { likeCommentMessages } from "../../../../shared/constant/message/likeCommetMessage";

export class LikeCommetController {
  constructor(
    private _addLikeUseCase: IAddLikeUSeCase,
    private _RemoveLikeUseCase: IRemoveLikeUSeCase,
    private _addCommentUseCase: IAddCommentUSeCase,
    private _deleteCommentUseCase: IdeleteCommentUseCase,
    private _getHomeServiceCommentUseCase: IGetHomeServiceCommetsUseCase,
    private _getPostCommentUseCase: IGetPostCommetsUseCase,
    private _getReplyCommentUseCase: IGetRepliesUseCase,
    private _getLikedUserListUseCase: IGetLikedUserListUseCase,
  ) {}

  addLike = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.postId;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!postId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._addLikeUseCase.execute(userId, postId);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: likeCommentMessages.SUCCESS.LIKE_ADDED,
    });
  };

  removeLike = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.postId;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!postId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._RemoveLikeUseCase.execute(userId, postId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.LIKE_REMOVED,
    });
  };

  addComment = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const postId = req.params.postId;
    const beauticianId = req.params.beauticianId;
    const { text, parentId, rating } = req.body;

    const input: IAddCommentInput = {
      userId,
      postId,
      beauticianId,
      text,
      rating,
      type: postId ? CommentType.POST : CommentType.HOME,
      ...(parentId && { parentId }),
    };

    await this._addCommentUseCase.execute(input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: likeCommentMessages.SUCCESS.COMMENT_ADDED,
    });
  };

  deleteComment = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { postId, commentId } = req.params;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!postId || !commentId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._deleteCommentUseCase.execute(userId, commentId, postId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.COMMENT_DELETED,
    });
  };

  getPostComment = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.postId;
    const limit = Number(req.query.limit) || 10;
    const cursor = (req.query.cursor as string) || null;

    if (!postId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this._getPostCommentUseCase.execute(
      postId,
      limit,
      cursor,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.COMMENTS_FETCHED,
      data,
    });
  };

  getHomeServiceComment = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const beauticianId = req.params.beauticianId;
    const limit = Number(req.query.limit) || 10;
    const cursor = (req.query.cursor as string) || null;

    if (!beauticianId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this._getHomeServiceCommentUseCase.execute(
      beauticianId,
      limit,
      cursor,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.COMMENTS_FETCHED,
      data,
    });
  };

  getReplyComments = async (req: Request, res: Response): Promise<void> => {
    const parentId = req.params.commentId;
    const limit = Number(req.query.limit) || 5;
    const cursor = (req.query.cursor as string) || null;

    if (!parentId) {
      throw new AppError(
        generalMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this._getReplyCommentUseCase.execute(
      parentId,
      limit,
      cursor,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.REPLIES_FETCHED,
      data,
    });
  };

  getLikedUserList = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.postId;
    const limit = Number(req.query.limit) || 10;
    const cursor = (req.query.cursor as string) || null;

    const data = await this._getLikedUserListUseCase.execute(
      postId,
      limit,
      cursor,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: likeCommentMessages.SUCCESS.LIKED_USERS_FETCHED,
      data,
    });
  };
}
