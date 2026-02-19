import { ICustomerViewProfileOutput } from "../../interfaceType/customerType";


export interface IViewEditProfileUseCase{
  execute(id:string):Promise<ICustomerViewProfileOutput>
}