import { ICategoryRequest } from "../../../../interfaceType/serviceType";

export interface IAddCategoryUseCase{
  execute(input:ICategoryRequest,id:string):Promise<void>
}