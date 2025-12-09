import { IOwnProfileOutput } from "../../interfaceType/publicType";

export interface IOwnProfileUseCase{
  execute(id:string):Promise<IOwnProfileOutput>
}