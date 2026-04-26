import { Request, Response } from "express";
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
import { postMessages } from "../../../../shared/constant/message/postMessage";

export class PostController {
  constructor(
    private _createPostUseCase: ICreatePostUSeCase,
    private _getHomeFeedUseCase: IGetHomeFeedUseCase,
    private _getTipsRentFeedUseCase: IGetTipsRentUseCase,
    private _getBeauticianPostUseCase: IGetBeauticianPostUSeCase,
    private _searchPostUseCase: ISearchPostUSeCase,
    private _getSignedUrlsUseCase: IGetSignedUploadUrlsUseCase,
  ) {}

  createPost = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const input = req.body;
    if (!beauticianId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this._createPostUseCase.execute(beauticianId, input);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: postMessages.SUCCESS.CREATED,
    });
  };

  getHomefeed = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;
    const cursor = (req.query.cursor as string) ?? null;
    const limit = Number(req.query.limit) || 10;

    const result = await this._getHomeFeedUseCase.execute(
      userId!,
      cursor,
      limit,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.HOME_FEED_FETCHED,
      ...result,
    });
  };

  getTipsRentfeed = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const cursorTips = (req.query.cursorTips as string) ?? null;
    const cursorRent = (req.query.cursorRent as string) ?? null;
    const limit = Number(req.query.limit) || 10;

    const result = await this._getTipsRentFeedUseCase.execute(
      userId!,
      cursorTips,
      cursorRent,
      limit,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.TIPS_RENT_FEED_FETCHED,
      ...result,
    });
  };

  getBeauticianPost = async (req: Request, res: Response): Promise<void> => {
    const beauticianId = req.user?.id;
    const postType = (req.query.postType as PostType) ?? PostType.POST;
    const cursor = (req.query.cursor as string) ?? null;
    const limit = Number(req.query.limit) || 12;

    if (!beauticianId) {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST);
    }

    const posts = await this._getBeauticianPostUseCase.execute(
      beauticianId,
      beauticianId,
      postType,
      cursor,
      limit,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.POSTS_FETCHED,
      ...posts,
    });
  };

  getBeauticianPostForUser = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user?.id;
    const beauticianId = req.params.id;
    const postType = (req.query.postType as PostType) ?? PostType.POST;
    const cursor = (req.query.cursor as string) ?? null;
    const limit = Number(req.query.limit) || 12;

    if (!beauticianId || !userId) {
      throw new AppError(generalMessages.ERROR.BAD_REQUEST);
    }

    const posts = await this._getBeauticianPostUseCase.execute(
      userId,
      beauticianId,
      postType,
      cursor,
      limit,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.POSTS_FETCHED,
      ...posts,
    });
  };

  getPostSearchResult = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.query as string;
    const cursor = (req.query.cursor as string) || null;

    if (!query || query.trim().length === 0) {
      res.status(200).json({ posts: [], nextCursor: null });
      return;
    }

    const result = await this._searchPostUseCase.execute(query, cursor);
    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.SEARCH_FETCHED,
      ...result,
    });
  };

  getSignedUploadUrl = async (req: Request, res: Response): Promise<void> => {
    const { files } = req.body;
    const data = await this._getSignedUrlsUseCase.execute(files);
    res.status(HttpStatus.OK).json({
      success: true,
      message: postMessages.SUCCESS.SIGNED_URLS_FETCHED,
      data,
    });
  };
}
