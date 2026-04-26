import { Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { AppError } from "../../../../domain/errors/appError";
import { authMessages } from "../../../../shared/constant/message/authMessages";
import { IFollowBeauticianUseCase } from "../../../../application/interface/public/follow/IFollowBeauticianUseCase";
import { IUnFollowBeauticianUseCase } from "../../../../application/interface/public/follow/IUnFollowBeauticianUseCase";
import { IGetFollowingListUseCase } from "../../../../application/interface/public/follow/IGetFollowingListUseCase";
import { followMessages } from "../../../../shared/constant/message/followMessage";

export class FollowController {
  constructor(
    private _followBeauticianUseCase: IFollowBeauticianUseCase,
    private _unFollowBeauticianUseCase: IUnFollowBeauticianUseCase,
    private _getFollowingListUseCase: IGetFollowingListUseCase,
  ) {}

  followBeautician = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { beauticianId } = req.params;

    await this._followBeauticianUseCase.execute(userId, beauticianId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: followMessages.SUCCESS.FOLLOWED,
      data: { isFollowing: true },
    });
  };

  unFollowBeautician = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { beauticianId } = req.params;
    const result = await this._unFollowBeauticianUseCase.execute(
      userId,
      beauticianId,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: followMessages.SUCCESS.UNFOLLOWED,
      data: result,
    });
  };

  getFollowingList = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        authMessages.ERROR.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const cursor = req.query.cursor as string | undefined;
    const result = await this._getFollowingListUseCase.execute(userId, cursor);

    res.status(HttpStatus.OK).json({
      success: true,
      message: followMessages.SUCCESS.LIST_FETCHED,
      data: result,
    });
  };
}
