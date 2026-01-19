import { IAddCustomServiceRequest } from "../../interfaceType/serviceType";

export interface IAddCustomServiceUseCase {
  execute(input: IAddCustomServiceRequest): Promise<void>;
}
