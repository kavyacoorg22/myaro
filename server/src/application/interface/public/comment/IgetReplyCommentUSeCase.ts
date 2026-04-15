import { IGetRepliesOutput } from "../../../interfaceType/commetLike";

export interface IGetRepliesUseCase {
  execute(
    parentId: string,
    limit?: number,
    cursor?: string | null
  ): Promise<IGetRepliesOutput>;
}