import { ILoginOutputDto } from "../../dtos/user";
import { IGoogleLoginInput } from "../../interfaceType/authtypes";

export interface IGoogleLoginUseCase {
    execute(input: IGoogleLoginInput): Promise<ILoginOutputDto>
}