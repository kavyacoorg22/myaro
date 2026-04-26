import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { IGetCategoryUseCase } from "../../../../interface/beauticianService/IGetCategoryUseCase";
import { IGetCategoryResponse } from "../../../../interfaceType/serviceType";
import { toGetCategoryDto } from "../../../../mapper/serviceMapper";

export class GetCategoryUseCase implements IGetCategoryUseCase {
  constructor(private _categoryRepo: ICategoryRepository) {}
  async execute(): Promise<IGetCategoryResponse> {
    const category = await this._categoryRepo.findAllActive();
    if (category === null) {
      return {
        category: [],
      };
    }

    const mapped = category.map((ca) => toGetCategoryDto(ca));
    return {
      category: mapped,
    };
  }
}
