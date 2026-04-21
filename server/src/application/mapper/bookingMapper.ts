import { Booking } from "../../domain/entities/booking";
import { Payment } from "../../domain/entities/payment";
import { Refund } from "../../domain/entities/refund";
import { User } from "../../domain/entities/User";
import { ICancelBookingDto, IGetBookingByIdDto } from "../dtos/booking";
import { IBookingListItem } from "../interfaceType/booking";

export function toBookingListItem(
  booking: Booking,
  user: User,
): IBookingListItem {
  return {
    booking,
    user: {
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      profileImg: user.profileImg,
    },
  };
}

export function toGetBookingById(
  booking: Booking,
  user: User,
): IGetBookingByIdDto {
  return {
    id: booking.id,
    chatId: booking.chatId,
    beauticianId: booking.beauticianId,
    userId: booking.chatId,
    services: booking.services,
    totalPrice: booking.totalPrice,
    address: booking.address,
    phoneNumber: booking.phoneNumber,
    slot: booking.slot,
    status: booking.status,
    rejectionReason: booking.rejectionReason ?? "",
    refundReason: booking.refundReason ?? "",
    fullName: user.fullName,
  };
}

export function toCancelBookingDto(result: {
  refund: Refund;
  payment: Payment;
}): ICancelBookingDto {
  return {
    success: true,
    refundId: result.refund.id,
    razorpayRefundId: result.refund.razorpayRefundId!,
    refundAmount: result.payment.amount,
    message: "Booking cancelled and refund initiated successfully.",
  };
}

export function toUserBookingListItem(
  booking: Booking,
  beautician: User,
): IBookingListItem {
  return {
    booking,
    user: {
      id: beautician.id,
      fullName: beautician.fullName,
      userName: beautician.userName,
      profileImg: beautician.profileImg,
    },
  };
}
