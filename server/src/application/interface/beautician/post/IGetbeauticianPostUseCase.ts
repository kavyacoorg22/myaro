import { PostType } from "../../../../domain/enum/userEnum";
import {  IGetBeauticianPostOutPut } from "../../../interfaceType/beauticianType";


export interface IGetBeauticianPostUSeCase {
  execute( beauticianId: string,
    postType: PostType  ,  
    cursor: string | null ,
    limit: number  ):Promise<IGetBeauticianPostOutPut>
}