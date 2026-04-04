import { IGetAllHomeFeedOutput } from "../../../interfaceType/beauticianType";


export interface IGetHomeFeedUseCase {
  execute(userId: string, cursor: string | null, limit: number):Promise<IGetAllHomeFeedOutput>
}