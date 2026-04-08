import { BookingServiceVO, BookingSlotVO } from "../../domain/entities/booking";
import { BookingStatus } from "../../domain/enum/bookingEnum";

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
  status:BookingStatus,
  rejectionReason:string
  fullName:string,
  refundReason:string

}

export interface ICancelBookingDto {
  success: boolean;
  refundId: string;
  razorpayRefundId: string;
  refundAmount: number;
  message: string;
}