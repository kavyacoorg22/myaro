import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BookingAction } from "../../../../domain/enum/bookingEnum";
import { UserRole } from "../../../../domain/enum/userEnum";

export type BookingHistoryDoc = Document & {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  action: BookingAction;
  performedBy: Types.ObjectId;
  role: UserRole;
  fromStatus: string;
  toStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

export const BookingHistorySchema = new Schema<BookingHistoryDoc>(
  {
    bookingId: { type: Schema.Types.ObjectId },
    action: {
      type: String,
      enum: Object.values(BookingAction),
      default: BookingAction.REQUEST,
    },
    performedBy: { type: Schema.Types.ObjectId },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    fromStatus: { type: String },
    toStatus: { type: String },
  },
  { timestamps: true },
);

export const BookingHistoryModel: Model<BookingHistoryDoc> =
  mongoose.models.BookingHistory ||
  mongoose.model("BookingHistory", BookingHistorySchema);
