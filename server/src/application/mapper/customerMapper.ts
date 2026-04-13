import { Refund } from "../../domain/entities/refund";
import { User } from "../../domain/entities/User";
import { ICustomerViewProfileDTO, IGetUserRefundSummeryDto } from "../dtos/customer";


export function toCustomerProfileDto(user:User):ICustomerViewProfileDTO{
    return{
      userName:user.userName,
      fullName:user.fullName,
      profileImg:user.profileImg
    }
}


export function toGetRefundSummeryDto(refund:Refund):IGetUserRefundSummeryDto{
  return{
   id:refund.id,
   amount:refund.amount,
   method:refund.method,
   refundType:refund.refundType,
   processedAt:refund.processedAt?.toDateString()??'',
  }
}