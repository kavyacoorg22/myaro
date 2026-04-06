
import { beauticianApi } from "../../constants/apiRoutes/beauticianRoutes"
import { publicApiRoutes } from "../../constants/apiRoutes/publicApiRoute"
import type { BookingActionType, BookingStatusType } from "../../constants/types/booking"
import type { UserRoleType } from "../../constants/types/User"
import {type IGetBookingByIdResponse, type ICreateBookingRequest, type IGetBeauticianBookingsResponse, type IUpdateBookingResponse } from "../../types/api/booking"
import type { BookingDto } from "../../types/dtos/booking"
import api, { axiosWrapper } from "../axiosWrapper"

export const BookingApi={
  createBooking:async(input:ICreateBookingRequest)=>{
    return await axiosWrapper<BookingDto>(api.post(publicApiRoutes.createBooking,
      input
    ))
  },
 getBookingByid:async(bookingId:string)=>{
  return await axiosWrapper<IGetBookingByIdResponse>(api.get(publicApiRoutes.getBookingById.replace(':bookingId',bookingId)))
 },
 updateBookingStatus:async(bookingId:string,action:BookingActionType,role:UserRoleType,rejectionReason?:string)=>{
  const data={
    action,
    role,
    ...(rejectionReason&&{rejectionReason})
  }
   return await axiosWrapper<IUpdateBookingResponse>(api.patch(publicApiRoutes.updateBookingStatus.replace(':bookingId',bookingId),data))
 },
 getBeauticianBookings:async(status:BookingStatusType,page:number,limit:number)=>{
  let params={
    status,
    page,
    limit
  }
  return await axiosWrapper<IGetBeauticianBookingsResponse>(api.get(beauticianApi.getBeauticianBookings,{params}))
 },
 lockSlot: async (input: { beauticianId: string; date: string; startTime: string; endTime: string }) => {
  return await axiosWrapper(api.post(publicApiRoutes.lockSlot, input));
}
}