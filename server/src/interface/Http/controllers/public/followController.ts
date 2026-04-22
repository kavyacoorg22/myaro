import { NextFunction, Request, Response } from "express";

import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IFollowBeauticianUseCase } from "../../../../application/interface/public/follow/IFollowBeauticianUseCase";
import { IUnFollowBeauticianUseCase } from "../../../../application/interface/public/follow/IUnFollowBeauticianUseCase";
import { IGetFollowingListUseCase } from "../../../../application/interface/public/follow/IGetFollowingListUseCase";

export class FollowController {
  constructor(
    private _followBeauticianUC: IFollowBeauticianUseCase,
    private _unFollowBeauticianUC: IUnFollowBeauticianUseCase,
    private _getFollowingListUC: IGetFollowingListUseCase,
  ) {}

  followBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log(req.body)
      console.log(req.params)
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { beauticianId } = req.params;
     console.log("follow hit →", { userId, beauticianId })
     console.log('reaching follow beatician controller')
      await this._followBeauticianUC.execute(userId, beauticianId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: { isFollowing: true },
      });
    } catch (err) {
      next(err);
    }
  };

  unFollowBeautician = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { beauticianId } = req.params;
      const result = await this._unFollowBeauticianUC.execute(
        userId,
        beauticianId,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getFollowingList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          authMessages.ERROR.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const cursor = req.query.cursor as string | undefined;
      const result = await this._getFollowingListUC.execute(userId, cursor);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
