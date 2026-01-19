import { IGetCustomServiceDetailResponse } from "../../interfaceType/serviceType";

export interface IGetCustomServiceDetailsUseCase {
  execute(customServiceId: string): Promise<IGetCustomServiceDetailResponse>;
}
