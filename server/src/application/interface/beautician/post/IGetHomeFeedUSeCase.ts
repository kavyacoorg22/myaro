import { IGetAllHomeFeedOutput } from "../../../interfaceType/beauticianType";


export interface IGetHomeFeedUseCase {
  execute( cursor: string | null, limit: number):Promise<IGetAllHomeFeedOutput>
}