import { BookingAction } from "../../domain/enum/bookingEnum";
import { UserRole } from "../../domain/enum/userEnum";
import { IBookingHistoryRepository } from "../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
 
export class BookingHistoryService {
  constructor(private bookingHistoryRepo: IBookingHistoryRepository) {}
 
  async log(input: {
    bookingId:   string;
    action:      BookingAction;
    performedBy: string;
    role:        UserRole;
    fromStatus:  string;
    toStatus:    string;
  }): Promise<void> {
    await this.bookingHistoryRepo.create(input);
  }
}