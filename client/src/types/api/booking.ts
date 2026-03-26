import type { BookingActionType, BookingStatusType } from "../../constants/types/booking";
import type { UserRoleType } from "../../constants/types/User";
import type { BookingDto, IGetBookingByIdDto } from "../dtos/booking";
import type { BackendResponse } from "./api";

export interface BookingServiceVO{
   serviceId:string,
   name:string,
   price:number
}

export interface BookingSlotVO{
  date:Date,
  time:string
}
export interface ICreateBookingRequest {
  chatId:       string;
  userId:       string;
  beauticianId: string;
  services:     BookingServiceVO[];
  totalPrice:   number;
  address:      string;
  phoneNumber:  string;
  slot:         BookingSlotVO;
}

export interface IUpdateBookingStatusInput{
  bookingId:       string;
  performedBy:     string;       
  role:            UserRoleType;
  action:          BookingActionType;
  rejectionReason?: string;
}

export interface IGetBeauticianBookingsRequest {
  beauticianId: string;
  status?:      BookingStatusType;
  page?:        number;
  limit?:       number;
}

export interface IBookingListItem {
  booking: BookingDto;
  user: {
    id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
  };
}

export interface IGetBeauticianBookingsResponse {
  bookings:    IBookingListItem[];
  total:       number;
  page:        number;
  totalPages:  number;
  hasMore:     boolean;
}


export interface IGetBookingByIdResponseData{
data:IGetBookingByIdDto
}

export interface IUpdateBookingResponseData{
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
  cancelledAt:Date|null,
}

export type IGetBookingByIdResponse=BackendResponse<IGetBookingByIdResponseData>
export type IUpdateBookingResponse=BackendResponse<IUpdateBookingResponseData>