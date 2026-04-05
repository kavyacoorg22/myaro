import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { ICreateOrderResponse, IVerifyPaymentRequest, IVerifyPaymentResponse } from "../../types/api/payment"
import api, { axiosWrapper } from "../axiosWrapper"


export const PaymentApi={
  createOrder:async(bookingId:string)=>{
    return await axiosWrapper<ICreateOrderResponse>(api.post(publicApiRoutes.createOrder.replace(':bookingId',bookingId)))
  },
  verifyPayment:async(input:IVerifyPaymentRequest)=>{
  return await axiosWrapper<IVerifyPaymentResponse>(api.post(publicApiRoutes.verifyPayment,
    input
  ))
  }
}

