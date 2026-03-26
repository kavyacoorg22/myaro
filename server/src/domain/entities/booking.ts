import { BookingStatus } from "../enum/bookingEnum"

export interface BookingServiceVO{
   serviceId:string,
   name:string,
   price:number
}

export interface BookingSlotVO{
  date:Date,
  time:string
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
  rejectionReason:string,
  cancelledAt:Date|null,
  createdAt:Date,
  updatedAt:Date,
}