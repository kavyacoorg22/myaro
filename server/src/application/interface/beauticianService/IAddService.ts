import { IAddServiceRequest } from "../../interfaceType/serviceType";

export interface IAddServiceUseCase {
  execute(input: IAddServiceRequest): Promise<void>;
}
