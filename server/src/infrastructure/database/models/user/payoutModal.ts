import mongoose, { Document, Model, Mongoose, Schema, Types } from "mongoose";
import { PayoutStatus } from "../../../../domain/enum/paymentEnum";

export type PayoutDoc=Document&{
  _id:Types.ObjectId,
  paymentId:Types.ObjectId,
  customerId:Types.ObjectId,
  beauticianId:Types.ObjectId,
  amount:number,
  status:PayoutStatus,
  adminNote:string,
  createdAt:Date,
  updatedAt:Date
}

export const PayoutSchema=new Schema<PayoutDoc>({
  paymentId:{type:Schema.Types.ObjectId},
  customerId:{type:Schema.Types.ObjectId},
  beauticianId:{type:Schema.Types.ObjectId},
  amount:{type:Number},
  status:{type:String,enum:Object.values(PayoutStatus),default:PayoutStatus.PENDING},
  adminNote:{type:String}
},{timestamps:true})

export const PayoutModel:Model<PayoutDoc>=mongoose.models.Payout|| mongoose.model<PayoutDoc>('Payout',PayoutSchema)