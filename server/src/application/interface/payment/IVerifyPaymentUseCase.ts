import { IVerifyPaymentOutPut, IVerifyPaymentUsecaseInput } from "../../interfaceType/paymentType";

export interface IVerifyPaymentUsecase {
  execute(input: IVerifyPaymentUsecaseInput): Promise<IVerifyPaymentOutPut>;
}