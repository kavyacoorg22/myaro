import { BookingStatus } from "../enum/bookingEnum"
import { RefundType } from "../enum/paymentEnum"

export interface BookingServiceVO{
   serviceId:string,
   name:string,
   price:number
}

export interface BookingSlotVO{
  date:Date,
  time:string,
   startMinutes: number,
  endMinutes: number,
}
export interface Booking{
  id:string,
  chatId:string,
  beauticianId:string,
  userId:string,
  services:BookingServiceVO[],
  totalPrice:number,
  address:string,
  phoneNumber:string,
  slot:BookingSlotVO,
  status:BookingStatus,
  rejectionReason?:string,
  cancelledAt:Date|null,
   clientNote: string | null,       
  beauticianNote: string | null,
  refundType?:RefundType
  disputeAt?: Date
  refundReason?: string        // customer reason for refund
disputeReason?: string       // beautician rejects → reason
  createdAt:Date,
  updatedAt:Date,
}