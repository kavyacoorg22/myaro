import { ChartPointDto, DashboardStatsDto } from "../../../../application/dtos/beautician";
import { BookingTrendDto } from "../../../../application/dtos/repo";
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
    beauticianNote?:string|null
  ): Promise<Booking | null>;
  findByBeauticianId(
    beauticianId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
  ): Promise<{bookings:Booking[],total:number}>;
  findByUserId(userId: string, page: number, limit: number, status?: BookingStatus): Promise<{bookings: Booking[], total: number}>
  findOverlapping(input: {
  beauticianId: string;
  date: Date;
  startMinutes: number;
  endMinutes: number;
}): Promise<Booking | null>;
updateByBookingId(id:string,data:Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>):Promise<Booking|null>
findByIds(ids: string[]): Promise<Booking[]>
findDisputed(params: {
  page: number;
  limit: number;
}): Promise<{ bookings: Booking[]; total: number }>;
getBookingTrendByMonth(year?:number): Promise<BookingTrendDto[]> 
getDashboardStats(beauticianId: string): Promise<DashboardStatsDto>;
getWeeklyEarnings(beauticianId: string): Promise<ChartPointDto[]>;
getMonthlyEarnings(beauticianId: string): Promise<ChartPointDto[]>;
getTotalEarnings(beauticianId: string): Promise<number> 
getPendingEarnings(beauticianId: string): Promise<number>
}
