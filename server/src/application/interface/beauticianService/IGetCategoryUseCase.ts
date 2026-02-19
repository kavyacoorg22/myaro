import { IGetCategoryResponse } from "../../interfaceType/serviceType";

export interface IGetCategoryUseCase {
  execute(): Promise<IGetCategoryResponse>;
}