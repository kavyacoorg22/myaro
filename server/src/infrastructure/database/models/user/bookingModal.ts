import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BookingStatus } from "../../../../domain/enum/bookingEnum";
import { RefundType } from "../../../../domain/enum/paymentEnum";

export type BookingDoc = Document & {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  beauticianId: Types.ObjectId;
  userId: Types.ObjectId;
  services: {
    serviceId: Types.ObjectId;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  address: string;
  phoneNumber: string;
  slot: {
    date: Date;
    time: string;
    startMinutes: number,
  endMinutes: number,
  };
  status: BookingStatus;
  rejectionReason: string;
  disputeAt:Date,
  refundType?:RefundType,
  refundReason?: string        // customer reason for refund
disputeReason?: string       // beautician rejects → reason
  cancelledAt: Date | null;
   clientNote: string | null,       
  beauticianNote: string | null,
  createdAt: Date;
  updatedAt: Date;
};

const BookingServiceSchema=new Schema({
 serviceId: { type: Schema.Types.ObjectId },
 name: { type: String },
  price: { type: Number },
},{_id:false})

const SlotSchema=new Schema({
  date:{type:Date},
  time:{type:String},
 startMinutes:{type:Number},
  endMinutes: {type:Number},
},{_id:false})

export const BookingSchema=new Schema<BookingDoc>({
  chatId:{type:Schema.Types.ObjectId},
  beauticianId:{type:Schema.Types.ObjectId},
  userId:{type:Schema.Types.ObjectId},
  services:{type:[BookingServiceSchema]},
  totalPrice:{type:Number},
  address:{type:String},
  phoneNumber:{type:String},
  slot:{type:SlotSchema},
  status:{type:String,enum:Object.values(BookingStatus),default:BookingStatus.REQUESTED},
  rejectionReason:{type:String},
  disputeAt:{type:Date},
  refundType:{type:String,enum:Object.values(RefundType)},
  refundReason:{type:String},
  disputeReason:{type:String},
  cancelledAt:{type:Date},
  clientNote:{type:String},
  beauticianNote:{type:String},
},{timestamps:true})

export const BookingModel:Model<BookingDoc>=mongoose.models.Booking||mongoose.model('Booking',BookingSchema)