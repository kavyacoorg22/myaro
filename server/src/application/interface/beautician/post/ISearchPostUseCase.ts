import { IGetPostSearchResult } from "../../../interfaceType/beauticianType";

export interface ISearchPostUSeCase {
  execute(query:string,cursor:string|null):Promise<IGetPostSearchResult>
}