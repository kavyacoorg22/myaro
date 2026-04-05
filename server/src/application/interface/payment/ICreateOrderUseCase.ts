import { ICreateOrderOutput, ICreateOrderUsecaseInput,  } from "../../interfaceType/paymentType";

export interface ICreateOrderUsecase {
  execute(input: ICreateOrderUsecaseInput): Promise<ICreateOrderOutput>;
}