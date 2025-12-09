import { ILoginOutput ,ILoginInput} from "../../interfaceType/authtypes";


export interface ILoginUseCase{
  execute(input:ILoginInput):Promise<ILoginOutput>
}