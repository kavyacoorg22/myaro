import { Category } from "../../../../../domain/entities/category";
import { CategoryServiceType } from "../../../../../domain/enum/serviceEnum";
import { AppError } from "../../../../../domain/errors/appError";
import { ICategoryRepository } from "../../../../../domain/repositoryInterface/ICategoryRepository";
import { HttpStatus } from "../../../../../shared/enum/httpStatus";
import { IAddCategoryUseCase } from "../../../../interface/admin/management/services/IAddCategoryUseCase";
import { ICategoryRequest } from "../../../../interfaceType/serviceType";

export class AddCategoryUseCase implements IAddCategoryUseCase {
  private _categoryRepo: ICategoryRepository;

  constructor(categoryRepo: ICategoryRepository) {
    this._categoryRepo = categoryRepo;
  }
  async execute(input: ICategoryRequest, id: string): Promise<void> {
    const { name, description } = input;

    if (!id.trim()) {
      throw new AppError("Creator ID is required", HttpStatus.BAD_REQUEST);
    }

    const existingCategory = await this._categoryRepo.findByName(name);

    if (existingCategory) {
      throw new AppError("category already exists", HttpStatus.CONFLICT);
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
