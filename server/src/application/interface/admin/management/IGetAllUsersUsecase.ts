import { IGetAllUserRequest, IGetAllUserResponse } from '../../../interfaceType/adminType';

export interface IGetAllUserUseCase {
    execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse>
}