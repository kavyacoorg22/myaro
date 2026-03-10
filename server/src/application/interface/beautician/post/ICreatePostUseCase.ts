import { ICreatePostInput } from "../../../interfaceType/beauticianType";


export interface ICreatePostUSeCase {
  execute(beautcianId:string,input:ICreatePostInput,files: Express.Multer.File[]):Promise<void>
}