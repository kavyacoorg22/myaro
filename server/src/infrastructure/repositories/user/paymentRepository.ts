import { Types } from "mongoose";
import { Payment } from "../../../domain/entities/payment";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { PaymentDoc, PaymentModel } from "../../database/models/user/paymentModal";
import { GenericRepository } from "../genericRepository";
import { Booking } from "../../../domain/entities/booking";
import { PaymentStatus } from "../../../domain/enum/paymentEnum";

export class PaymentRepository extends GenericRepository<Payment,PaymentDoc> implements IPaymentRepository{

constructor()
{
  super(PaymentModel)
}

async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
  const doc=await PaymentModel.create(data)
  return this.map(doc)
}

async findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null> {
  const doc=await PaymentModel.findOne({razorpayOrderId:new Types.ObjectId(razorpayOrderId)})
  return doc?this.map(doc):null
}

async updateByRazorpayOrderId(razorpayOrderId: string, data: Partial<Pick<Payment, "razorpayPaymentId" | "razorpaySignature" | "status">>): Promise<Payment | null> {
  const doc=await PaymentModel.findOneAndUpdate({razorpayOrderId},{$set:data},{new:true})
  return doc?this.map(doc):null
}

async findByBookingId(bookingId: string): Promise<Payment | null> {
  const doc=await PaymentModel.findOne({bookingId:new Types.ObjectId(bookingId)})
  return doc?this.map(doc):null
}
  async updateById(
    id: string,
    data: Partial<Omit<Payment, "id" | "createdAt" | "updatedAt">>
  ): Promise<Payment | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await PaymentModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return doc ? this.map(doc) : null;
  }

    async updateStatus(
    id: string,
    status: PaymentStatus,
    extra?: {
      refundReason?: string;
      razorpayRefundId?: string;
    }
  ): Promise<Payment | null> {
    const doc=await PaymentModel.findByIdAndUpdate(id, {
      status,
      ...(extra || {}),
    });
    return doc ? this.map(doc) : null;
  }
async findById(id: string): Promise<Payment | null> {
   const doc=await PaymentModel.findById(id)
   return doc?this.map(doc):null
 }

 async findAll({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: PaymentStatus;
}): Promise<{ payments: Payment[]; total: number }> {
  const query: any = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    PaymentModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    PaymentModel.countDocuments(query),
  ]);

  return {
    payments: docs.map(doc => this.map(doc)),
    total,
  };
}

async findByIds(ids: string[]): Promise<Payment[]> {
  const objectIds = ids.map(id => new Types.ObjectId(id));
  const docs = await PaymentModel.find({ _id: { $in: objectIds } });
  return docs.map(doc => this.map(doc));
}

async findPaidByBookingId(bookingId: string): Promise<Payment | null> {
  const doc = await PaymentModel.findOne({
    bookingId: new Types.ObjectId(bookingId),
    status: PaymentStatus.PAID,
  });
  return doc ? this.map(doc) : null;
}

async findPendingByBookingId(bookingId: string): Promise<Payment | null> {
  const doc = await PaymentModel.findOne({
    bookingId: new Types.ObjectId(bookingId),
    status: PaymentStatus.PENDING,
  });
  return doc ? this.map(doc) : null;
}
protected map(doc:PaymentDoc):Payment
{
  const base=super.map(doc)
  return{
    id:base.id.toString(),
    bookingId:doc.bookingId.toString(),
    userId:doc.userId.toString(),
    razorpayOrderId:doc.razorpayOrderId,
    razorpayPaymentId:doc.razorpayPaymentId,
    razorpaySignature:doc.razorpaySignature,
    amount:doc.amount,
    currency:doc.currency,
    status:doc.status,
    mode:doc.mode,
    failureReason:doc.failureReason,
    paidAt:doc.paidAt,
    refundedId:doc.refundedId?.toString(),
    refundReason:doc.refundReason,
    releasedAt:doc.releasedAt,
    releasedBy:doc.releasedBy?.toString(),
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt

  }
}
}