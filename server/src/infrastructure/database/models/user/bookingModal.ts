import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BookingStatus } from "../../../../domain/enum/bookingEnum";

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
  };
  status: BookingStatus;
  rejectionReason: string;
  cancelledAt: Date | null;
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
  time:{type:String}
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
  cancelledAt:{type:Date}
},{timestamps:true})

export const BookingModel:Model<BookingDoc>=mongoose.models.Booking||mongoose.model('Booking',BookingSchema)