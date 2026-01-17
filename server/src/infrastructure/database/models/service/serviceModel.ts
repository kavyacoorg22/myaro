import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ServiceDoc = Document & {
  _id: Types.ObjectId;
  name: string;
  categoryId: Types.ObjectId;
  suggestedPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const ServiceSchema = new Schema<ServiceDoc>(
  {
    name: { type: String },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    suggestedPrice: { type: Number,default:0 },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);

export const ServiceModel: Model<ServiceDoc> =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);
