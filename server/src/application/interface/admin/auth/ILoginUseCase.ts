import { IAdminLoginRequest, IAdminLoginResponse } from '../../../interfaceType/adminType';

export interface IAdminLoginUseCase {
    execute(input: IAdminLoginRequest): Promise<IAdminLoginResponse>;
}