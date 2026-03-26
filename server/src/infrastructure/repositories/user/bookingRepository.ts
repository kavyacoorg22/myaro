import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking";
import { BookingStatus } from "../../../domain/enum/bookingEnum";
import { IBookingRepository } from "../../../domain/repositoryInterface/User/booking/IBookingRepository";
import { BookingDoc, BookingModel } from "../../database/models/user/bookingModal";
import { GenericRepository } from "../genericRepository";

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

  async updateStatus(id: string, status: BookingStatus, reason?: string): Promise<Booking|null> {
    const doc=await BookingModel.findByIdAndUpdate(id,{
      $set:{status,...(reason&& {rejectionReason:reason})
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
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
   }
  }
}