import { Beautician } from "../../../domain/entities/Beautician";
import { ISearchBeauticianResultDto } from "../../dtos/beautician";
import { IBeauticianRegistrationInput } from "../../interfaceType/beauticianType";

export interface ISearchResultUseCase{
  execute(query:string):Promise<ISearchBeauticianResultDto[]>
}