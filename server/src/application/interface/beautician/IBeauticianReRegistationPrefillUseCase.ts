import { IBeauticianReRegistrationPrefilOutPut } from "../../interfaceType/beauticianType";


export interface IGetReRegistrationPrefillUseCase {
  execute(userId: string): Promise<IBeauticianReRegistrationPrefilOutPut>;
}