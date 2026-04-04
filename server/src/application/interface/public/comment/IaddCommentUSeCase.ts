import { IAddCommentInput } from "../../../interfaceType/commetLike";

export interface IAddCommentUSeCase {
  execute(input:IAddCommentInput):Promise<void>
}