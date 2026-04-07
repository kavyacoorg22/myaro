import { Booking, BookingServiceVO, BookingSlotVO } from "../../domain/entities/booking";
import { BookingAction, BookingStatus } from "../../domain/enum/bookingEnum";
import { UserRole } from "../../domain/enum/userEnum";
import { IGetBookingByIdDto } from "../dtos/booking";

export interface ICreateBookingInput {
  chatId:       string;
  userId:       string;
  beauticianId: string;
  services:     BookingServiceVO[];
  totalPrice:   number;
  address:      string;
  phoneNumber:  string;
  slot:         BookingSlotVO;
  clientNote:string|null;
}

export interface IUpdateBookingStatusInput{
  bookingId:       string;
  performedBy:     string;       
  role:            UserRole;
  action:          BookingAction;
  rejectionReason?: string;
  beauticianNote?:string
}

export interface IGetBeauticianBookingsInput {
  beauticianId: string;
  status?:      BookingStatus;
  page?:        number;
  limit?:       number;
}

export interface IBookingListItem {
  booking: Booking;
  user: {
    id:         string;
    fullName:   string;
    userName:   string;
    profileImg: string | undefined;
  };
}

export interface IGetBeauticianBookingsResult {
  bookings:    IBookingListItem[];
  total:       number;
  page:        number;
  totalPages:  number;
  hasMore:     boolean;
}

export interface IGetBookingByIdResponse{
data:IGetBookingByIdDto
}

export interface ILockSlotInput {
  beauticianId: string;
  date: string;      
  startTime: string;   
  endTime: string;     
  userId: string;
}

export interface IRequestRefundInput{
  bookingId:string,
  userId:string,
  refundReason:string
}

export interface IApproveRefundUInput{
  bookingId:string,
  beauticianId:string
}