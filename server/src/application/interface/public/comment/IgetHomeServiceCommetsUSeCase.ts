import { IGetHomeServiceCommentsOutPut, IGetPostCommentsOutPut } from "../../../interfaceType/commetLike";


export interface IGetHomeServiceCommetsUseCase{
  execute(beauticianId:string , limit: number,
  cursor?: string|null):Promise<IGetHomeServiceCommentsOutPut>
}