import { Booking } from "../../domain/entities/booking";
import { BookingStatus } from "../../domain/enum/bookingEnum";
import { AppError } from "../../domain/errors/appError";
import { IBookingRepository } from "../../domain/repositoryInterface/User/booking/IBookingRepository";
import { HttpStatus } from "../../shared/enum/httpStatus";
 
export class BookingValidatorService {
  constructor(private bookingRepo: IBookingRepository) {}
 
  async getAndValidateOwnership(
    bookingId: string,
    userId: string,
    ownerField: "userId" | "beauticianId",
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
    if (booking[ownerField] !== userId) {
      throw new AppError("Access denied", HttpStatus.FORBIDDEN);
    }
    return booking;
  }
 
  async getAndValidateStatus(
    bookingId: string,
    userId: string,
    ownerField: "userId" | "beauticianId",
    allowedStatuses: BookingStatus[],
  ): Promise<Booking> {
    const booking = await this.getAndValidateOwnership(bookingId, userId, ownerField);
    if (!allowedStatuses.includes(booking.status)) {
      throw new AppError(
        `Booking must be in status: ${allowedStatuses.join(" or ")}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return booking;
  }

  async getAndValidateStatusOnly(
  bookingId: string,
  allowedStatuses: BookingStatus[],
): Promise<Booking> {
  const booking = await this.bookingRepo.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
  if (!allowedStatuses.includes(booking.status)) {
    throw new AppError(`Invalid booking status`, HttpStatus.BAD_REQUEST);
  }
  return booking;
}
}