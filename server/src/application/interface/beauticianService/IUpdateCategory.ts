import { ICategoryRequest } from "../../interfaceType/serviceType";

export interface IUpdateCategoryUseCase {
  execute(id: string, input: ICategoryRequest): Promise<void>;
}
