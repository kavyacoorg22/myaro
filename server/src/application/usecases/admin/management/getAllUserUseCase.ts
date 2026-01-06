import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IGetAllUserUseCase } from "../../../interface/admin/management/IGetAllUsersUsecase";
import {
  IGetAllUserRequest,
  IGetAllUserResponse,
} from "../../../interfaceType/adminType";
import { toUserDetailDto } from "../../../mapper/userMapper";
import { SortFilter } from "../../../../domain/enum/sortFilterEnum";

export class GetAllUserUseCase implements IGetAllUserUseCase {
  private _userRepo: IUserRepository;

  constructor(private userRepo: IUserRepository) {
    this._userRepo = userRepo;
  }

  async execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse> {
    const { search, sort, role, page = 1, limit = 10 } = input;

    const finalSort =
      sort === SortFilter.ASC || sort === SortFilter.DESC
        ? sort
        : SortFilter.DESC;
    const skip = (page - 1) * limit;

    const users = await this._userRepo.findAll({
      search,
      sort: finalSort,
      limit,
      skip,
      role,
    });

    const mapped = users.map((user) => toUserDetailDto(user));

    const totalCount = await this.userRepo.countAll({ search, role });

    return {
      user: mapped,
      totalCount,
    };
  }
}
