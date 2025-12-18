
import { IBeauticianRegistartionOutput, IBeauticianRegistrationInput } from "../../interfaceType/beauticianType";

export interface IBeauticianRegisterUseCase{
  execute(input:IBeauticianRegistrationInput,id:string):Promise<IBeauticianRegistartionOutput>
}