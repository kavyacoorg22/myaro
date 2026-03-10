import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type RecurringExceptionDoc = Document & {
  _id: Types.ObjectId
  recurringId: Types.ObjectId
  beauticianId: Types.ObjectId
  date: Date
}

export const RecurringExceptionSchema = new Schema<RecurringExceptionDoc>({
  recurringId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "RecurringSchedule"
  },
  beauticianId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true })


RecurringExceptionSchema.index(
  { recurringId: 1, date: 1 },
  { unique: true }
)

export const RecurringExceptionModel: Model<RecurringExceptionDoc> =
  mongoose.models.RecurringException ||
  mongoose.model<RecurringExceptionDoc>(
    "RecurringException",
    RecurringExceptionSchema
  )