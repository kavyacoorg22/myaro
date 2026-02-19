import { ICustomerEditProfileInput } from "../../interfaceType/customerType";


export interface ICustomerEditProfileUseCase{
  execute(id:string,input:ICustomerEditProfileInput):Promise<void>
}