import { BookingAction } from "../enum/bookingEnum";
import { UserRole } from "../enum/userEnum";

export interface BookingHistory{
  id:string,
  bookingId:string,
  action:BookingAction,
  performedBy:string,
  role:UserRole,
  fromStatus:string,
  toStatus:string,
  createdAt:Date,
  updatedAt:Date,

}