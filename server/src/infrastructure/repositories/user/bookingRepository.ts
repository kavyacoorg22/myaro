import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking";
import { BookingStatus } from "../../../domain/enum/bookingEnum";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { BookingDoc, BookingModel } from "../../database/models/user/bookingModal";
import { GenericRepository } from "../genericRepository";
import { BookingTrendDto } from "../../../application/dtos/repo";
import { fillEmptyMonths, toMonthName } from "../../../utils/monthUtil";

export class BookingRepository extends GenericRepository<Booking,BookingDoc> implements  IBookingRepository{
  constructor(){
    super(BookingModel)
  }
  async create(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const doc=await BookingModel.create(data)
    return this.map(doc)
  }

 async findById(id: string): Promise<Booking | null> {
    const doc=await BookingModel.findById(id)
    return doc?this.map(doc):null
  }

  async updateStatus(id: string, status: BookingStatus, reason?: string,beauticianNote?:string|null): Promise<Booking|null> {
    const doc=await BookingModel.findByIdAndUpdate(id,{
      $set:{status,...(reason&& {rejectionReason:reason}),...(beauticianNote&&{beauticianNote:beauticianNote})
    }},{new:true})
    return doc? this.map(doc):null
  }

async findByBeauticianId(beauticianId: string,  page: number, limit: number,status?: BookingStatus): Promise<{bookings:Booking[],total:number}> {
  const query:any={beauticianId:new Types.ObjectId(beauticianId)}
  if(status) query.status=status

  let skip=(page-1)*limit

  const [bookings,total]=await Promise.all([
    BookingModel.
    find(query)
    .sort({'slot.date':-1})
    .skip(skip)
    .limit(limit),
    BookingModel.countDocuments(query)
  ])

  return {
    bookings:bookings.map((b)=>this.map(b)),
    total
  }

}

async findOverlapping({
  beauticianId,
  date,
  startMinutes,
  endMinutes
}: {
  beauticianId: string;
  date: Date;
  startMinutes: number;
  endMinutes: number;
}): Promise<Booking | null> {

  const doc = await BookingModel.findOne({
    beauticianId,
    'slot.date': date,
    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.ACCEPTED] },
    'slot.startMinutes': { $lt: endMinutes },
    'slot.endMinutes':   { $gt: startMinutes },
  });

  return doc ? this.map(doc) : null;
}

async updateByBookingId(id: string, data: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>): Promise<Booking | null> {
  const doc=await BookingModel.findByIdAndUpdate(
    id,
    {$set:data},
    {new:true}
  )

  return doc?this.map(doc):null
}

async findByIds(ids: string[]): Promise<Booking[]> {
  const objectIds = ids.map(id => new Types.ObjectId(id));
  const docs = await BookingModel.find({ _id: { $in: objectIds } });
  return docs.map(doc => this.map(doc));
}

async findDisputed(params: {
  page: number;
  limit: number;
}): Promise<{ bookings: Booking[]; total: number }> {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const filter = { status: BookingStatus.DISPUTE };

  const [docs, total] = await Promise.all([
    BookingModel.find(filter)
      .sort({ disputeAt: -1 })
      .skip(skip)
      .limit(limit),
    BookingModel.countDocuments(filter),
  ]);

  return {
    bookings: docs.map((doc) => this.map(doc)),
    total,
  };
}

async getBookingTrendByMonth(year = new Date().getFullYear()): Promise<BookingTrendDto[]> {
  const raw = await BookingModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt:  new Date(`${year + 1}-01-01`),
        },
        status: {
          $in: [
            BookingStatus.COMPLETED,       // 'completed'
            BookingStatus.CANCELLED,       // 'cancelled'
            BookingStatus.REFUND_APPROVED, // 'refund_approved' ← closest to "refunded"
          ]
        },
      },
    },

    {
      $group: {
        _id: { $month: "$createdAt" },
        completed: { $sum: { $cond: [{ $eq: ["$status", BookingStatus.COMPLETED] }, 1, 0] } },
        cancelled:  { $sum: { $cond: [{ $eq: ["$status", BookingStatus.CANCELLED] }, 1, 0] } },
        refunded:   { $sum: { $cond: [{ $eq: ["$status", BookingStatus.REFUND_APPROVED] }, 1, 0] } },
      },
    },

    { $sort: { _id: 1 } },
  ]);

  const named: BookingTrendDto[] = raw.map((r) => ({
    month:     toMonthName(r._id),
    completed: r.completed,
    cancelled: r.cancelled,
    refunded:  r.refunded,
  }));

  return fillEmptyMonths(named, { completed: 0, cancelled: 0, refunded: 0 });
}
  protected map(doc:BookingDoc):Booking {
   const base=super.map(doc)
   return{
    id:base.id.toString(),
    chatId:doc.chatId.toString(),
    beauticianId:doc.beauticianId.toString(),
    userId:doc.userId.toString(),
    services:doc.services.map((s)=>({
      serviceId:s.serviceId.toString(),
      name:s.name,
      price:s.price
    })),
    totalPrice:doc.totalPrice,
    address:doc.address,
    phoneNumber:doc.phoneNumber,
    slot:doc.slot,
    status:doc.status,
    rejectionReason:doc.rejectionReason,
    cancelledAt:doc.cancelledAt,
    clientNote:doc.clientNote??null,
    beauticianNote:doc.beauticianNote??null,
    disputeAt:doc.disputeAt,
    refundType:doc.refundType,
    refundReason:doc.refundReason,
    disputeReason:doc.disputeReason,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
   }
  }
}