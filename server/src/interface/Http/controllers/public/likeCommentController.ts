import { NextFunction, Request, Response } from "express";
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

export class LikeCommetController {
  constructor(
    private _addLikeUC: IAddLikeUSeCase,
    private _RemoveLikeUC: IRemoveLikeUSeCase,
    private _addCommentUC: IAddCommentUSeCase,
    private _deleteCommentUC: IdeleteCommentUseCase,
    private _getHomeServiceCommentUC: IGetHomeServiceCommetsUseCase,
    private _getPostCommentUseCase: IGetPostCommetsUseCase,
    private _getReplyCommentUC:IGetRepliesUseCase,
    private _getLikedUserListUseCase:IGetLikedUserListUseCase
  ) {}

  addLike = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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

      await this._addLikeUC.execute(userId, postId);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "like Added",
      });
    } catch (err) {
      next(err);
    }
  };

  removeLike = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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

      await this._RemoveLikeUC.execute(userId, postId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "like Added",
      });
    } catch (err) {
      next(err);
    }
  };
 addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const postId = req.params.postId;             
    const beauticianId = req.params.beauticianId; 
    const { text,parentId,rating } = req.body;                   
    console.log(rating)
    const input: IAddCommentInput = {
      userId,
      postId,
      beauticianId,
      text,
      rating,
      type: postId ? CommentType.POST : CommentType.HOME,
      ...(parentId && {parentId})
    };

    await this._addCommentUC.execute(input);

    res.status(HttpStatus.CREATED).json({ success: true, message: "Comment added" });
  } catch (err) {
    next(err);
  }
};
  deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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

      await this._deleteCommentUC.execute(userId, commentId, postId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Comment deleted",
      });
    } catch (err) {
      next(err);
    }
  };
  getPostComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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
        message: "Data returned",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  getHomeServiceComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.params.beauticianId;
      const limit = Number(req.query.limit) || 10;
      const cursor = (req.query.cursor as string) || null;

      if (!beauticianId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await this._getHomeServiceCommentUC.execute(
        beauticianId,
        limit,
        cursor,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Data returned",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
  getReplyComments= async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parentId = req.params.commentId;
      const limit = Number(req.query.limit) || 5;
      const cursor = (req.query.cursor as string) || null;

      if (!parentId) {
        throw new AppError(
          generalMessages.ERROR.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await this._getReplyCommentUC.execute(
        parentId,
        limit,
        cursor,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Data returned",
        data,
      });
    } catch (err) {
      next(err);
    }

  };
  getLikedUserList=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
       const postId=req.params.postId
          const limit = Number(req.query.limit) || 10;
      const cursor = (req.query.cursor as string) || null;

      const data=await this._getLikedUserListUseCase.execute(postId,limit,cursor)
      res.status(HttpStatus.OK).json({
        success:true,
        data
      })
    }catch(err)
    {
      next(err)
    }
  }
}
