import { AppError } from "../../../../domain/errors/appError";
import { IPostRepository } from "../../../../domain/repositoryInterface/beautician/IPostRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { ILikeRepository } from "../../../../domain/repositoryInterface/User/ILikeRepository";
import { generalMessages } from "../../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../../shared/enum/httpStatus";
import { IGetLikedUserListDto } from "../../../dtos/likeCommet";
import { IGetLikedUserListUseCase } from "../../../interface/public/like/IGetLikedUserList";
import { IGetLikedUserListResponse } from "../../../interfaceType/commetLike";
import { toGetLikedUserListDto } from "../../../mapper/likeCommentMapper";

export class GetLikedUserListUseCase implements IGetLikedUserListUseCase {
  constructor(
    private _postRepo: IPostRepository,
    private _likeRepo: ILikeRepository,
    private _userRepo: IUserRepository,
  ) {}
  async execute(
    postId: string,
    limit: number,
    cursor?: string | null,
  ): Promise<IGetLikedUserListResponse> {
    const post = await this._postRepo.findById(postId);
    if (!post) {
      throw new AppError(generalMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const likeDocs = await this._likeRepo.findByPostId(postId, limit, cursor);

    const userIds = [...new Set(likeDocs.likes.map((doc) => doc.userId))];

    const users = await this._userRepo.findUsersByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    const data = userIds
      .map((userId) => {
        const user = userMap.get(userId);
        return user ? toGetLikedUserListDto(user) : null;
      })
      .filter(Boolean) as IGetLikedUserListDto[];
    return {
      data,
      nextCursor: likeDocs.nextCursor,
    };
  }
}
