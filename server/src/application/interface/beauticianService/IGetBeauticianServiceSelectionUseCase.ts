import { IBeauticianServiceSelectionResponse } from "../../interfaceType/serviceType";

export interface IGetBeauticianServiceSelectionUseCase {
  execute(beauticianId: string): Promise<IBeauticianServiceSelectionResponse>;
}
