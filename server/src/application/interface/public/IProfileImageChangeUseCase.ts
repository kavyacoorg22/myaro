import { IProfileImageChangeOutput } from "../../interfaceType/publicType";


export interface IProfileImageChangeUseCase{
  execute(id:string,profileImg:Express.Multer.File):Promise<IProfileImageChangeOutput>
}