import { Category } from "../../../../../domain/entities/category";
import { CategoryServiceType } from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { serviceMessages } from "../../../../../shared/constant/message/serviceMessage";
import { userMessages } from "../../../../../shared/constant/message/userMessage";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IAddCategoryUseCase } from "../../../../interface/beauticianService/IAddCategoryUseCase";
import { ICategoryRequest } from "../../../../interfaceType/serviceType";

export class AddCategoryUseCase implements IAddCategoryUseCase {
  constructor(private _categoryRepo: ICategoryRepository) {}
  async execute(input: ICategoryRequest, id: string): Promise<void> {
    const { name, description } = input;

    if (!id.trim()) {
      throw new AppError(
        userMessages.ERROR.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingCategory = await this._categoryRepo.findByName(name);

    if (existingCategory) {
      throw new AppError(
        serviceMessages.ERROR.CATEGORY_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const categoryDto: Omit<Category, "id" | "createdAt" | "updatedAt"> = {
      name: name.trim(),
      type: CategoryServiceType.SYSTEM,
      createdBy: id,
      isActive: true,
      description: description.trim() || "",
    };

    await this._categoryRepo.create(categoryDto);
  }
}
