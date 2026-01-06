import { SortFilter } from "../../../../domain/enum/sortFilterEnum";
import { IBeauticianRepository } from "../../../../domain/repositoryInterface/IBeauticianRepository";
import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IGetAllBeauticianUseCase } from "../../../interface/admin/management/IGetAllBeauticianUseCase";
import {
  IGetAllBeauticianRequest,
  IGetAllBeauticianResponse,
} from "../../../interfaceType/adminType";
import { toBeauticianDeatilDto } from "../../../mapper/beauticianMapper";

export class GetAllBeauticianUseCase implements IGetAllBeauticianUseCase {
  private _beauticianRepo: IBeauticianRepository;
  private _userRepo: IUserRepository;

  constructor(
    beauticianRepo: IBeauticianRepository,
    userRepo: IUserRepository
  ) {
    this._beauticianRepo = beauticianRepo;
    this._userRepo = userRepo;
  }

  async execute(
    input: IGetAllBeauticianRequest
  ): Promise<IGetAllBeauticianResponse> {
    const { sort, verificationStatus, page = 1, limit = 10 } = input;

    const finalSort =
      sort === SortFilter.ASC || sort === SortFilter.DESC
        ? sort
        : SortFilter.DESC;
    const skip = (page - 1) * limit;

    const beautician = await this._beauticianRepo.findAll({
      sort: finalSort,
      limit,
      skip,
      verificationStatus,
    });
    const totalCount = await this._beauticianRepo.countAll({
      verificationStatus,
    });
    const totalPages = Math.ceil(totalCount / limit);

    const users = await this._userRepo.findUsersByIds(
      beautician.map((ele) => ele.userId)
    );

    const userMap = new Map(users.map((u) => [u.id, u]));

    const mapped = beautician.map((b) =>
      toBeauticianDeatilDto(b, userMap.get(b.userId))
    );

    return {
      beautician: mapped,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }
}
