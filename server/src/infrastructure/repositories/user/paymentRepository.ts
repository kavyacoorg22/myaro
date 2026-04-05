import { Types } from "mongoose";
import { Payment } from "../../../domain/entities/payment";
import { IPaymentRepository } from "../../../domain/repositoryInterface/User/booking/IPaymentRepository";
import { PaymentDoc, PaymentModel } from "../../database/models/user/paymentModal";
import { GenericRepository } from "../genericRepository";

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
    releasedAt:doc.releasedAt,
    releasedBy:doc.releasedBy?.toString(),
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt

  }
}
}