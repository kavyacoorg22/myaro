import { IGetTipsAndRentOutput } from "../../../interfaceType/beauticianType";

export interface IGetTipsRentUseCase {
  execute(
    cursorTips: string | null,
    cursorRent: string | null,
    limit: number,
  ): Promise<IGetTipsAndRentOutput>;
}
