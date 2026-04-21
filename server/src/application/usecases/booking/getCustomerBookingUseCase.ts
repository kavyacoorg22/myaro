import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository"
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository"
import { IGetCustomerBookingsUseCase } from "../../interface/booking/IGetCustomerBookings"
import { IBookingListItem, IGetCustomerBookingsInput, IGetCustomerBookingsResult } from "../../interfaceType/booking"
import { toUserBookingListItem } from "../../mapper/bookingMapper"

export class GetCustomerBookingsUseCase implements IGetCustomerBookingsUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _userRepo: IUserRepository,
  ) {}

  async execute({ userId, status, page = 1, limit = 10 }:IGetCustomerBookingsInput):Promise<IGetCustomerBookingsResult> {
    const { bookings, total } = await this._bookingRepo.findByUserId(userId, page, limit, status)
    const totalPages = Math.ceil(total / limit)

    const beauticianIds = [...new Set(bookings.map(b => b.beauticianId))]
    const beauticians = await this._userRepo.findUsersByIds(beauticianIds)
    const beauticianMap = new Map(beauticians.map(b => [b.id, b]))

    const enriched = bookings
      .map(booking => {
        const beautician = beauticianMap.get(booking.beauticianId)
        if (!beautician) return null
        return toUserBookingListItem(booking, beautician) 
      })
      .filter((b): b is IBookingListItem=> b !== null)

    return { bookings: enriched, total, page, totalPages, hasMore: page < totalPages }
  }
}