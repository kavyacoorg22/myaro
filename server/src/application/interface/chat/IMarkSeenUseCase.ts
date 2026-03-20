import { IMarkSeenInput } from "../../interfaceType/chatType";

export interface IMarkSeenUseCase{
  execute(input:IMarkSeenInput):Promise<void>
}