import mongoose, { Document, Model, Schema, Types } from "mongoose";
import {
  CategoryServiceType,
  CustomServiceStatus,
} from "../../../../domain/enum/serviceEnum";

export type CustomServiceDoc = Document & {
  _id:Types.ObjectId,
  type: CategoryServiceType;
  beauticianId: Types.ObjectId;
  category: {
    name?: string;
    categoryId?: string;
  };
  service: {
    name: string;
    price: number;
    isHomeServiceAvailable: boolean;
  };
  status: CustomServiceStatus;
  reviewdBy?: Types.ObjectId;
  reviewdAt?: Date;
  result?: {
    serviceId?: Types.ObjectId;
    categoryId?: Types.ObjectId;
  };
  createdAt: string;
  updatedAt: string;
};

const CategorySchema = new Schema(
  {
    name: { type: String },
    categoryId: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const ServiceSchema = new Schema({
  name: { type: String },
  price: { type: Number },
  isHomeServiceAvailable: { type: Boolean },
});

const ResultSchema = new Schema({
  serviceId: { type: Schema.Types.ObjectId },
  categoryId: { type: Schema.Types.ObjectId },
});

export const CustomServiceSchema = new Schema<CustomServiceDoc>(
  {
    type: {
      type: String,
      enum: Object.values(CategoryServiceType),
      default: CategoryServiceType.CUSTOM,
    },
    beauticianId: { type: Schema.Types.ObjectId, ref: "Beautician" },
    category: { type: CategorySchema },
    service: { type: ServiceSchema },
    status: {
      type: String,
      enum: Object.values(CustomServiceStatus),
      default: CustomServiceStatus.PENDING,
    },
    reviewdBy: { type: Schema.Types.ObjectId },
    reviewdAt: { type: Date },
    result: { type: ResultSchema },
  },
  { timestamps: true }
);

export const CustomServiceModel: Model<CustomServiceDoc> =
  mongoose.models.CustomService ||
  mongoose.model("CustomService", CustomServiceSchema);
