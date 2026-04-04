import { NextFunction, Request, Response } from "express";
import { ICreatePostUSeCase } from "../../../../application/interface/beautician/post/ICreatePostUseCase";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { PostType } from "../../../../domain/enum/userEnum";
import { IGetHomeFeedUseCase } from "../../../../application/interface/beautician/post/IGetHomeFeedUSeCase";
import { IGetTipsRentUseCase } from "../../../../application/interface/beautician/post/IGetTipsRentUseCase";
import { IGetBeauticianPostUSeCase } from "../../../../application/interface/beautician/post/IGetbeauticianPostUseCase";
import { ISearchPostUSeCase } from "../../../../application/interface/beautician/post/ISearchPostUseCase";
import { IGetSignedUploadUrlsUseCase } from "../../../../application/interface/beautician/post/IGetUploadSignedUrlUseCase";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";

export class PostController {
  constructor(
    private createPostUC: ICreatePostUSeCase,
    private getHomeFeedUC: IGetHomeFeedUseCase,
    private getTipsRentFeedUC: IGetTipsRentUseCase,
    private getBeauticianPostUC: IGetBeauticianPostUSeCase,
    private searchPostUseCase: ISearchPostUSeCase,
    private getSignedUrlsUseCase: IGetSignedUploadUrlsUseCase,
  ) {}

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const input = req.body;
      console.log(`create post input... `, input);
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.createPostUC.execute(beauticianId, input);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Post created successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  getHomefeed = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id??null;
      const cursor = (req.query.cursor as string) ?? null;
      const limit = Number(req.query.limit) || 10;
     
      const result = await this.getHomeFeedUC.execute(userId!, cursor, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "data returned",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  getTipsRentfeed = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const cursorTips = (req.query.cursorTips as string) ?? null;
      const cursorRent = (req.query.cursorRent as string) ?? null;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getTipsRentFeedUC.execute(
        userId!,
        cursorTips,
        cursorRent,
        limit,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "data returned",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  getBeauticianPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const postType = (req.query.postType as PostType) ?? PostType.POST;
      const cursor = (req.query.cursor as string) ?? null;
      const limit = Number(req.query.limit) || 12;
      console.log("beautician post -> id of beautician", beauticianId);
      console.log("post controller reached");
      if (!beauticianId) {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST);
      }

      const posts = await this.getBeauticianPostUC.execute(
        beauticianId,
        beauticianId,
        postType,
        cursor,
        limit,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "data returned",
        ...posts,
      });
    } catch (err) {
      next(err);
    }
  };
  getBeauticianPostForUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const beauticianId = req.params.id;
      const postType = (req.query.postType as PostType) ?? PostType.POST;
      const cursor = (req.query.cursor as string) ?? null;
      const limit = Number(req.query.limit) || 12;
      if (!beauticianId || !userId) {
        throw new AppError(generalMessages.ERROR.BAD_REQUEST);
      }

      const posts = await this.getBeauticianPostUC.execute(
        userId,
        beauticianId,
        postType,
        cursor,
        limit,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "data returned",
        ...posts,
      });
    } catch (err) {
      next(err);
    }
  };
  getPostSearchResult = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query.query as string;
      const cursor = (req.query.cursor as string) || null;

      if (!query || query.trim().length === 0) {
        res.status(200).json({ posts: [], nextCursor: null });
        return;
      }

      const result = await this.searchPostUseCase.execute(query, cursor);
      res.status(HttpStatus.OK).json({
        sucess: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  getSignedUploadUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { files } = req.body;
      const data = await this.getSignedUrlsUseCase.execute(files);
      res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      next(err);
    }
  };
}
