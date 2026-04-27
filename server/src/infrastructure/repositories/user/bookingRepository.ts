import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking";
import { BookingStatus } from "../../../domain/enum/bookingEnum";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import {
  BookingDoc,
  BookingModel,
} from "../../database/models/user/bookingModal";
import { GenericRepository } from "../genericRepository";
import { BookingTrendDto } from "../../../application/dtos/repo";
import { fillEmptyMonths, toMonthName } from "../../../utils/monthUtil";
import {
  ChartPointDto,
  DashboardStatsDto,
} from "../../../application/dtos/beautician";
import { FilterQuery } from "mongoose";

export class BookingRepository
  extends GenericRepository<Booking, BookingDoc>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }
  async create(
    data: Omit<Booking, "id" | "createdAt" | "updatedAt">,
  ): Promise<Booking> {
    const doc = await BookingModel.create(data);
    return this.map(doc);
  }

  async findById(id: string): Promise<Booking | null> {
    const doc = await BookingModel.findById(id);
    return doc ? this.map(doc) : null;
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    reason?: string,
    beauticianNote?: string | null,
  ): Promise<Booking | null> {
    const doc = await BookingModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          ...(reason && { rejectionReason: reason }),
          ...(beauticianNote && { beauticianNote: beauticianNote }),
        },
      },
      { new: true },
    );
    return doc ? this.map(doc) : null;
  }

  async findByBeauticianId(
    beauticianId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
  ): Promise<{ bookings: Booking[]; total: number }> {
    const query: FilterQuery<BookingDoc> = {
      beauticianId: new Types.ObjectId(beauticianId),
    };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .sort({ "slot.date": -1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments(query),
    ]);

    return {
      bookings: bookings.map((b) => this.map(b)),
      total,
    };
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
  ): Promise<{ bookings: Booking[]; total: number }> {
    const query: FilterQuery<BookingDoc> = {
      userId: new Types.ObjectId(userId),
    };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .sort({ "slot.date": -1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments(query),
    ]);

    return { bookings: bookings.map((b) => this.map(b)), total };
  }

  async findOverlapping({
    beauticianId,
    date,
    startMinutes,
    endMinutes,
  }: {
    beauticianId: string;
    date: Date;
    startMinutes: number;
    endMinutes: number;
  }): Promise<Booking | null> {
    const doc = await BookingModel.findOne({
      beauticianId,
      "slot.date": date,
      status: { $in: [BookingStatus.CONFIRMED, BookingStatus.ACCEPTED] },
      "slot.startMinutes": { $lt: endMinutes },
      "slot.endMinutes": { $gt: startMinutes },
    });

    return doc ? this.map(doc) : null;
  }

  async updateByBookingId(
    id: string,
    data: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Booking | null> {
    const doc = await BookingModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );

    return doc ? this.map(doc) : null;
  }

  async findByIds(ids: string[]): Promise<Booking[]> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const docs = await BookingModel.find({ _id: { $in: objectIds } });
    return docs.map((doc) => this.map(doc));
  }

  async findDisputed(params: {
    page: number;
    limit: number;
  }): Promise<{ bookings: Booking[]; total: number }> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const filter = { status: BookingStatus.DISPUTE };

    const [docs, total] = await Promise.all([
      BookingModel.find(filter).sort({ disputeAt: -1 }).skip(skip).limit(limit),
      BookingModel.countDocuments(filter),
    ]);

    return {
      bookings: docs.map((doc) => this.map(doc)),
      total,
    };
  }

  async getBookingTrendByMonth(
    year = new Date().getFullYear(),
  ): Promise<BookingTrendDto[]> {
    const raw = await BookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
          status: {
            $in: [
              BookingStatus.COMPLETED, // 'completed'
              BookingStatus.CANCELLED, // 'cancelled'
              BookingStatus.REFUND_APPROVED, // 'refund_approved' ← closest to "refunded"
            ],
          },
        },
      },

      {
        $group: {
          _id: { $month: "$createdAt" },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", BookingStatus.COMPLETED] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", BookingStatus.CANCELLED] }, 1, 0],
            },
          },
          refunded: {
            $sum: {
              $cond: [
                { $eq: ["$status", BookingStatus.REFUND_APPROVED] },
                1,
                0,
              ],
            },
          },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    const named: BookingTrendDto[] = raw.map((r) => ({
      month: toMonthName(r._id),
      completed: r.completed,
      cancelled: r.cancelled,
      refunded: r.refunded,
    }));

    return fillEmptyMonths(named, { completed: 0, cancelled: 0, refunded: 0 });
  }

async getDashboardStats(beauticianId: string): Promise<DashboardStatsDto> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayAgg, monthAgg, todayEarningsAgg] = await Promise.all([
    // today's bookings by slot date
    BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          "slot.date": { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", BookingStatus.COMPLETED] }, 1, 0] },
          },
          upcoming: {
            $sum: {
              $cond: [
                { $in: ["$status", [BookingStatus.CONFIRMED, BookingStatus.ACCEPTED]] },
                1,
                0,
              ],
            },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", BookingStatus.REQUESTED] }, 1, 0] },
          },
        },
      },
    ]),

    // monthly earnings — PAID_OUT by updatedAt
    BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          status: BookingStatus.PAID_OUT,  // ✅ fixed from COMPLETED
          updatedAt: { $gte: monthStart, $lte: todayEnd },
        },
      },
      {
        $group: { _id: null, monthlyEarnings: { $sum: "$totalPrice" } },
      },
    ]),

    // today's earnings — PAID_OUT by updatedAt (independent of slot date)
    BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          status: BookingStatus.PAID_OUT,  // ✅ admin released today
          updatedAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: { _id: null, todayEarnings: { $sum: "$totalPrice" } },
      },
    ]),
  ]);

  const t = todayAgg[0];
  return {
    todayBookingsCount:   t?.total     ?? 0,
    completedToday:       t?.completed ?? 0,
    upcomingToday:        t?.upcoming  ?? 0,
    pendingRequestsCount: t?.pending   ?? 0,
    todayEarnings:        todayEarningsAgg[0]?.todayEarnings ?? 0,  // ✅ separate
    monthlyEarnings:      monthAgg[0]?.monthlyEarnings       ?? 0,
  };
}

  async getWeeklyEarnings(beauticianId: string): Promise<ChartPointDto[]> {
    const now = new Date();

    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const raw = await BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          status: BookingStatus.PAID_OUT,
          updatedAt: { $gte: weekStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$slot.date" }, // 1=Sun … 7=Sat
          earnings: { $sum: "$totalPrice" },
        },
      },
    ]);

    const DAY_LABEL: Record<number, string> = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    };

    const result: ChartPointDto[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dow = d.getDay() + 1;
      const found = raw.find((r) => r._id === dow);
      result.push({ label: DAY_LABEL[dow], earnings: found?.earnings ?? 0 });
    }

    return result;
  }

  async getMonthlyEarnings(beauticianId: string): Promise<ChartPointDto[]> {
    const now = new Date();

    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const raw = await BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          status: BookingStatus.PAID_OUT,
          updatedAt: { $gte: sixMonthsAgo, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
          },
          earnings: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result: ChartPointDto[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const found = raw.find(
        (r) =>
          r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1,
      );
      result.push({
        label: MONTHS[d.getMonth()],
        earnings: found?.earnings ?? 0,
      });
    }

    return result;
  }

  async getTotalEarnings(beauticianId: string): Promise<number> {
    const now = new Date();

    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    const raw = await BookingModel.aggregate([
      {
        $match: {
          beauticianId: new Types.ObjectId(beauticianId),
          status: BookingStatus.PAID_OUT,
          updatedAt: { $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    return raw[0]?.total ?? 0;
  }

  async getPendingEarnings(beauticianId: string): Promise<number> {
  const raw = await BookingModel.aggregate([
    {
      $match: {
        beauticianId: new Types.ObjectId(beauticianId),
        status: BookingStatus.COMPLETED, 
      },
    },
    {
      $group: { _id: null, total: { $sum: "$totalPrice" } },
    },
  ]);
  return raw[0]?.total ?? 0;
}
  protected map(doc: BookingDoc): Booking {
    const base = super.map(doc);
    return {
      id: base.id.toString(),
      chatId: doc.chatId.toString(),
      beauticianId: doc.beauticianId.toString(),
      userId: doc.userId.toString(),
      services: doc.services.map((s) => ({
        serviceId: s.serviceId.toString(),
        name: s.name,
        price: s.price,
      })),
      totalPrice: doc.totalPrice,
      address: doc.address,
      phoneNumber: doc.phoneNumber,
      slot: doc.slot,
      status: doc.status,
      rejectionReason: doc.rejectionReason,
      cancelledAt: doc.cancelledAt,
      clientNote: doc.clientNote ?? null,
      beauticianNote: doc.beauticianNote ?? null,
      disputeAt: doc.disputeAt,
      refundType: doc.refundType,
      refundReason: doc.refundReason,
      disputeReason: doc.disputeReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
