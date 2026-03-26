import { Types } from "mongoose";
import { BookingHistory } from "../../../domain/entities/bookingHistory";
import { IBookingHistoryRepository } from "../../../domain/repositoryInterface/User/booking/IBookingHistoryRepository";
import { BookingHistoryDoc, BookingHistoryModel } from "../../database/models/user/bookingHistory";
import { GenericRepository } from "../genericRepository";

export class BookingHistoryRepository extends GenericRepository<BookingHistory,BookingHistoryDoc> implements IBookingHistoryRepository{
  constructor(){
    super(BookingHistoryModel)
  }

  async create(data: Omit<BookingHistory, "id" | "createdAt" | "updatedAt">): Promise<BookingHistory> {
    const doc=await BookingHistoryModel.create(data)
    return this.map(doc)
  }
  
  async findByBookingId(bookingId: string): Promise<BookingHistory[]> {
    const docs=await BookingHistoryModel.find({bookingId:new Types.ObjectId(bookingId)})
    return docs.map((doc)=>this.map(doc))
  }
  protected map(doc:BookingHistoryDoc):BookingHistory
  {
    const base=super.map(doc)
    return{
      id:base.id.toString(),
      bookingId:doc.bookingId.toString(),
      action:doc.action,
      performedBy:doc.performedBy.toString(),
      role:doc.role,
      fromStatus:doc.fromStatus,
      toStatus:doc.toStatus,
      createdAt:doc.createdAt,
      updatedAt:doc.updatedAt

    }
  }
}