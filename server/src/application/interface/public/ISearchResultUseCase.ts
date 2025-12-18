
import { ISearchBeauticianResultDto } from "../../dtos/beautician";


export interface ISearchResultUseCase{
  execute(query:string):Promise<ISearchBeauticianResultDto[]>
}