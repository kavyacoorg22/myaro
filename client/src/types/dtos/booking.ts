import type { BookingStatusType } from "../../constants/types/booking"

export interface BookingServiceVO{
   serviceId:string,
   name:string,
   price:number
}

export interface BookingSlotVO{
  date:Date,
  time:string
}
export interface BookingDto{
  id:string,
  chatId:string,
  beauticianId:string,
  userId:string,
  services:BookingServiceVO[],
  totalPrice:number,
  address:string,
  phoneNumber:string,
  slot:BookingSlotVO,
  status:BookingStatusType,
  rejectionReason:string,
  clientNote?:string|null,
  beauticianNote?:string|null,
  cancelledAt:Date|null,
}

export interface IGetBookingByIdDto{
     id:string,
  chatId:string,
  beauticianId:string,
  userId:string,
  services:BookingServiceVO[],
  totalPrice:number,
  address:string,
  phoneNumber:string,
  slot:BookingSlotVO,
  status:BookingStatusType,
  rejectionReason:string,
  fullName:string,
  refundReason:string
}