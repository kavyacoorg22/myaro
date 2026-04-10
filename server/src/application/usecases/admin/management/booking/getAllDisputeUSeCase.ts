import { Booking } from "../../../../../domain/entities/booking";
import { IUserRepository } from "../../../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { IGetAllDisputesDto } from "../../../../dtos/admin";
import { IGetAllDisputesUseCase } from "../../../../interface/admin/management/booking/IGetAllDisputesUseCase";
import { IGetAllDisputeInput, IGetAllDisputeOutPut } from "../../../../interfaceType/adminType";


export class GetAllDisputesUseCase implements IGetAllDisputesUseCase {
  constructor(
    private bookingRepo:    IBookingRepository,
    private userRepo:       IUserRepository,
  ) {}

  async execute({ page = 1, limit = 10 }: IGetAllDisputeInput): Promise<IGetAllDisputeOutPut> {

    const { bookings, total } = await this.bookingRepo.findDisputed({ page, limit });

    const totalPages = Math.ceil(total / limit);

    const userIds       = [...new Set(bookings.map((b: Booking) => b.userId))];
    const beauticianIds = [...new Set(bookings.map((b: Booking) => b.beauticianId))];

    const users       = await this.userRepo.findUsersByIds(userIds);
    const beauticians = await this.userRepo.findUsersByIds(beauticianIds);

    const userMap       = new Map(users.map(u => [u.id, u]));
    const beauticianMap = new Map(beauticians.map(b => [b.id, b]));

    // 4. Map to DTO
    const data = bookings
      .map((booking: Booking): IGetAllDisputesDto| null => {
        const user       = userMap.get(booking.userId);
        const beautician = beauticianMap.get(booking.beauticianId);

        if (!user || !beautician) return null;

        return {
          disputeId:      booking.id,
          bookingId:      booking.id,
          customerName:   `${user.fullName}`,
          beauticianName: `${beautician.fullName} `,
          status:         booking.status,
          disputeReason:  booking.disputeReason ?? null,
          disputeAt:      booking.disputeAt,
        };
      })
      .filter((item): item is IGetAllDisputesDto => item !== null);

    return { data, total, page, totalPages, hasMore: page < totalPages };
  }
}