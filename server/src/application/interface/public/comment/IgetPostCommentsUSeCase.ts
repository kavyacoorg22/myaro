import { IGetPostCommentsOutPut } from "../../../interfaceType/commetLike";


export interface IGetPostCommetsUseCase{
  execute(postId:string,limit:number,cursor?:string|null):Promise<IGetPostCommentsOutPut>
}