import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IFollowRepository } from "../../../../domain/repositoryInterface/User/IFollowRepository";
import { IFollowingListDto } from "../../../dtos/follow";
import { IGetFollowingListUseCase } from "../../../interface/public/follow/IGetFollowingListUseCase";
import { IGetFollowingListResponse } from "../../../interfaceType/followType";
import { toFollowingListDto } from "../../../mapper/userMapper";

const LIMIT = 10;

export class GetFollowingListUseCase implements IGetFollowingListUseCase {
  constructor(
    private readonly _followRepo: IFollowRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    userId: string,
    cursor?: string,
  ): Promise<IGetFollowingListResponse> {
    const follows = await this._followRepo.getFollowingList(
      userId,
      LIMIT,
      cursor,
    );

    const hasNextPage = follows.length > LIMIT;
    const trimmed = hasNextPage ? follows.slice(0, LIMIT) : follows;

    const beauticianIds = trimmed.map((f) => f.beauticianId);
    const users = await this._userRepo.findUsersByIds(beauticianIds);

    const userMap = new Map(users.map((u) => [u.id, u]));

    const data = trimmed
      .map((f) => {
        const user = userMap.get(f.beauticianId);
        return user ? toFollowingListDto(user) : null;
      })
      .filter((dto): dto is IFollowingListDto => dto !== null);

    const nextCursor = hasNextPage ? trimmed[trimmed.length - 1].id : null;

    return { data, nextCursor };
  }
}
