import { BookingHistory } from "../../../entities/bookingHistory";

export interface IBookingHistoryRepository {
  create(
    data: Omit<BookingHistory, "id" | "createdAt" | "updatedAt">,
  ): Promise<BookingHistory>;
  findByBookingId(bookingId: string): Promise<BookingHistory[]>;
}
