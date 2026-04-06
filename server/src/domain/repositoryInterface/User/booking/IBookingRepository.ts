import { Booking } from "../../../entities/booking";
import { BookingStatus } from "../../../enum/bookingEnum";

export interface IBookingRepository {
  create(
    data: Omit<Booking, "id" | "createdAt" | "updatedAt">,
  ): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  updateStatus(
    id: string,
    status: BookingStatus,
    reason?: string,
  ): Promise<Booking | null>;
  findByBeauticianId(
    beauticianId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
  ): Promise<{bookings:Booking[],total:number}>;
  findOverlapping(input: {
  beauticianId: string;
  date: Date;
  startMinutes: number;
  endMinutes: number;
}): Promise<Booking | null>;
}
