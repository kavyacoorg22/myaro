import {  IVerificationRequest } from '../../../interfaceType/adminType';
import { IResponse } from '../../../interfaceType/authtypes';

export interface IRejectBeauticianUseCase{
   execute(input:IVerificationRequest): Promise<IResponse>
}