import {  IViewBeauticianResponse,  } from '../../../interfaceType/adminType';

export interface IViewBeauticianDetailsUseCase {
    execute(id:string): Promise<IViewBeauticianResponse>
}