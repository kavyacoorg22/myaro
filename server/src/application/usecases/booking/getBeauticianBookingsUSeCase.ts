import { Booking } from "../../../domain/entities/booking";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IGetBeauticianBookingsUseCase } from "../../interface/booking/IGetBeauticianBookingUseCase";
import { IBookingListItem, IGetBeauticianBookingsInput, IGetBeauticianBookingsResult } from "../../interfaceType/booking";
import { toBookingListItem } from "../../mapper/bookingMapper";


export class GetBeauticianBookingsUSeCase implements IGetBeauticianBookingsUseCase{
  constructor(
    private bookingRepo: IBookingRepository,
    private userRepo:    IUserRepository,
  ) {}

  async execute({
    beauticianId,
    status,
    page  = 1,
    limit = 10,
  }: IGetBeauticianBookingsInput): Promise<IGetBeauticianBookingsResult> {


    const { bookings, total } = await this.bookingRepo.findByBeauticianId(
      beauticianId,
      page,
      limit,
      status,
    );

    const totalPages = Math.ceil(total / limit);

    const userIds = [...new Set<string>(bookings.map((b:Booking) => b.userId))];
    const users   = await this.userRepo.findUsersByIds(userIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = bookings
      .map((booking:Booking) => {
        const user = userMap.get(booking.userId);
        if (!user) return null;
        return toBookingListItem(booking, user);
      })
      .filter((b:IBookingListItem|null): b is IBookingListItem => b !== null);

    return {
      bookings:  enriched,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  }
}