import { Booking } from "../../../domain/entities/booking";
import { AppError } from "../../../domain/errors/appError";
import { IUserRepository } from "../../../domain/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { generalMessages } from "../../../shared/constant/message/generalMessage";
import { HttpStatus } from "../../../shared/enum/httpStatus";
import { IGetBookingByIdUseCase } from "../../interface/booking/IGetBookingById";
import { IGetBookingByIdResponse } from "../../interfaceType/booking";
import { toGetBookingById } from "../../mapper/bookingMapper";


export class GetBookingByIdUSeCase implements IGetBookingByIdUseCase{
    constructor(private bookingRepo: IBookingRepository,private userRepo:IUserRepository) {}

  async execute(bookingId: string, requesterId: string): Promise<IGetBookingByIdResponse> {

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new AppError("Booking not found.", HttpStatus.NOT_FOUND);

    const isParticipant =
      booking.userId === requesterId ||
      booking.beauticianId === requesterId;

    if (!isParticipant) {
      throw new AppError("Access denied.", HttpStatus.FORBIDDEN);
    }
    const user=await this.userRepo.findByUserId(booking.userId)
    if(!user)
    {
      throw new AppError(generalMessages.ERROR.NOT_FOUND,HttpStatus.NOT_FOUND)
    }
    const data= toGetBookingById(booking,user);
    return {data}
  }
}