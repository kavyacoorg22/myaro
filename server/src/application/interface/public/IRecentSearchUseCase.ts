import { IRecentSearchOutput } from "../../interfaceType/publicType";


export interface IRecentSearchUseCase{
  execute(userId:string):Promise<IRecentSearchOutput>
}