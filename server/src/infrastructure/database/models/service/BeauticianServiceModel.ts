import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type BeauticianServiceDoc = Document & {
  _id:Types.ObjectId,
  beauticianId: Types.ObjectId;
  serviceId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  serviceName: string;
  categoryName: string;
  price: number;
  isHomeServiceAvailable: boolean;
  submissionId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const BeauticianServiceSchema = new Schema<BeauticianServiceDoc>(
  {
    beauticianId: {
      type: Schema.Types.ObjectId,
      ref: "Beautician",
      required: true,
    },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    serviceName: { type: String },
    categoryName: { type: String },
    price: { type: Number },
    isHomeServiceAvailable: { type: Boolean ,default:false},
    submissionId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);


BeauticianServiceSchema.index(
  { beauticianId: 1, serviceId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      serviceId: { $ne: null }
    }
  }
);


BeauticianServiceSchema.index(
  { beauticianId: 1, submissionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      submissionId: { $ne: null }
    }
  }
);


export const BeauticianServiceModel: Model<BeauticianServiceDoc> =
  mongoose.models.BeauticianService ||
  mongoose.model("BeauticianService", BeauticianServiceSchema);
