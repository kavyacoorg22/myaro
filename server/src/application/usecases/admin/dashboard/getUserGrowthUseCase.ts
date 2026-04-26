import { IUserRepository } from "../../../../domain/repositoryInterface/IUserRepository";
import { IGetUserGrowthUSeCase } from "../../../interface/admin/management/dashboard/getUserGrowthUseCase";
import { IUserGrowthOutPut } from "../../../interfaceType/adminType";
import { toUserGrowthDto } from "../../../mapper/adminMapper";

export class GetUserGrowthUseCae implements IGetUserGrowthUSeCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(year?: number): Promise<IUserGrowthOutPut> {
    const result = await this._userRepo.getUserGrowthByMonth(year);
    const data = result.map((d) => toUserGrowthDto(d));
    return { data };
  }
}
