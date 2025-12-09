import { IGetAllBeauticianRequest, IGetAllBeauticianResponse,  } from '../../../interfaceType/adminType';

export interface IGetAllBeauticianUseCase {
    execute(input: IGetAllBeauticianRequest): Promise<IGetAllBeauticianResponse>
}