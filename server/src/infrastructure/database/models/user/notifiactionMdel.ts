import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { NotificationCategory, NotificationType } from "../../../../domain/enum/notificationEnum";

export type NotificationDoc = Document & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  category: NotificationCategory;
  title?: string;
  message: string;
  metadata?: {
    bookingId?: Types.ObjectId;
    paymentId?: Types.ObjectId;
    refundId?: Types.ObjectId;
  };
  isRead: boolean;
  isDeleted: boolean;
  scheduledFor?: Date;
  isSent:boolean
  createdAt: Date;
  updatedAt: Date;
};

const MetadataSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId },
    paymentId: { type: Schema.Types.ObjectId },
    refundId: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

export const NotificationSchema = new Schema<NotificationDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(NotificationCategory),
      required: true,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: MetadataSchema,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    scheduledFor: {
      type: Date,
      index:true
    },
    isSent:{type:Boolean}
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel: Model<NotificationDoc> =
  mongoose.models.Notification ||
  mongoose.model<NotificationDoc>("Notification", NotificationSchema);