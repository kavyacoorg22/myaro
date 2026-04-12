import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { PaymentMode, PaymentStatus } from "../../../../domain/enum/paymentEnum";

export type PaymentDoc=Document&{
  _id:Types.ObjectId,
  bookingId:Types.ObjectId,
  userId:Types.ObjectId,
    razorpayOrderId: string,      // created when  call razorpay.orders.create()
  razorpayPaymentId?: string,   // available only after payment success
  razorpaySignature?: string,   // available only after verification
  amount:number,
  currency: string;
  status:PaymentStatus,
  mode:PaymentMode,
   failureReason?: string;   
  paidAt?: Date;
    refundReason?: string
  refundedId?: Types.ObjectId
  releasedAt?:Date,
  releasedBy?:Types.ObjectId,
  createdAt:Date,
  updatedAt:Date,
}

const PaymentSchema=new Schema<PaymentDoc>({
  bookingId:{type:Schema.Types.ObjectId},
  userId:{type:Schema.Types.ObjectId},
   razorpayOrderId:   { type: String, required: true },   
  razorpayPaymentId: { type: String },                  
  razorpaySignature: { type: String }, 
  amount:{type:Number},
  currency:{type:String},
  status:{type:String,enum:Object.values(PaymentStatus)},
  mode:{type:String,enum:Object.values(PaymentMode)},
  failureReason:{type:String},
    refundReason:{type: String},
  refundedId:{type:Schema.Types.ObjectId},
  paidAt:{type:Date},
  releasedAt:{type:Date},
  releasedBy:{type:Schema.Types.ObjectId}
},{timestamps:true})

PaymentSchema.index(
  { bookingId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: PaymentStatus.PAID }
  }
);
export const PaymentModel:Model<PaymentDoc>=mongoose.models.Payment||mongoose.model<PaymentDoc>('Payment',PaymentSchema)