import { IGetPamphletResponse } from "../../interfaceType/serviceType";

export interface IGetPamphletUseCase {
  execute(beauticianId: string): Promise<IGetPamphletResponse>;
}
