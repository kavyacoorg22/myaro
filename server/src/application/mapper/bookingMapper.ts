import { Booking } from "../../domain/entities/booking";
import { User } from "../../domain/entities/User";
import { IGetBookingByIdDto } from "../dtos/booking";
import { IBookingListItem } from "../interfaceType/booking";

export function toBookingListItem(booking: Booking, user: User): IBookingListItem {
  return {
    booking,
    user: {
      id:         user.id,
      fullName:   user.fullName,
      userName:   user.userName,
      profileImg: user.profileImg,
    },
  };
}

export function toGetBookingById(booking:Booking,user:User):IGetBookingByIdDto{
  return{
    id:booking.id,
    chatId:booking.chatId,
    beauticianId:booking.beauticianId,
    userId:booking.chatId,
    services:booking.services,
    totalPrice:booking.totalPrice,
    address:booking.address,
    phoneNumber:booking.phoneNumber,
    slot:booking.slot,
    status:booking.status,
    rejectionReason:booking.rejectionReason??'',
    refundReason:booking.refundReason??'',
    fullName:user.fullName
  }
}