import { IGetTipsAndRentOutput } from "../../../interfaceType/beauticianType";

export interface IGetTipsRentUseCase {
  execute(
    userId: string,
    cursorTips: string | null,
    cursorRent: string | null,
    limit: number,
  ): Promise<IGetTipsAndRentOutput>;
}
