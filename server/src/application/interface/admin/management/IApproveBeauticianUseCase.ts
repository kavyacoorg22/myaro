import {  IVerificationRequest,  } from '../../../interfaceType/adminType';
import { IResponse } from '../../../interfaceType/authtypes';

export interface IApproveBeauticianUseCase{
    execute(input:IVerificationRequest): Promise<IResponse>
}