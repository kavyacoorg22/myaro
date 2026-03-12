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

export class PostController {
  constructor(private createPostUC: ICreatePostUSeCase,
    private getHomeFeedUC:IGetHomeFeedUseCase,
    private getTipsRentFeedUC:IGetTipsRentUseCase,
    private getBeauticianPostUC:IGetBeauticianPostUSeCase,
    private searchPostUseCase:ISearchPostUSeCase
  ) {}

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beauticianId = req.user?.id;
      const input = req.body;
      console.log(`create post input... `,input)
      if (!beauticianId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

    const files = req.files as Express.Multer.File[] ?? [];
      await this.createPostUC.execute(beauticianId, input,files);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Post created successfully",
      });
    } catch (err) {
      next(err);
    }
  };

 getHomefeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cursor = req.query.cursor as string ?? null;
    const limit = Number(req.query.limit) || 10;

    const result = await this.getHomeFeedUC.execute(cursor, limit);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'data returned',
      ...result
    });
  } catch (err) {
    next(err);
  }
};

getTipsRentfeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cursorTips = req.query.cursorTips as string ?? null;
    const cursorRent = req.query.cursorRent as string ?? null;
    const limit = Number(req.query.limit) || 10;

    const result = await this.getTipsRentFeedUC.execute(cursorTips, cursorRent, limit);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'data returned',
      ...result
    });
  } catch (err) {
    next(err);
  }
};

  getBeauticianPost=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const { beauticianId } = req.params;
  const postType = req.query.postType as PostType ?? PostType.REEL;
  const cursor = req.query.cursor as string ?? null;
  const limit = Number(req.query.limit) || 12;

  const posts=await this.getBeauticianPostUC.execute(beauticianId,postType,cursor,limit)

  res.status(HttpStatus.OK).json({
    success:true,
    message:'data returned',
    ...posts
  })
    }catch(err)
    {
      next(err)
    }
  }
  getPostSearchResult=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
       const query=req.query.query as string
       const cursor=(req.query.cursor as string)||null

       if (!query || query.trim().length === 0) {
      res.status(200).json({ posts: [], nextCursor: null });
      return;
    }

    const result = await this.searchPostUseCase.execute(query, cursor);
    res.status(HttpStatus.OK).json({
      sucess:true,
      ...result
    });

    }catch(err)
    {
      next(err)
    }
  }
}
