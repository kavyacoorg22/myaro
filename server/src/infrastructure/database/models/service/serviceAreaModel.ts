import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LocationSubDoc = {
  placeId: string;
  city: string;
  lat: number;
  lng: number;
  formattedString: string;
};
export type ServiceAreaDoc = Document & {
  _id: Types.ObjectId;
  beauticianId: Types.ObjectId;
  homeServiceLocation:LocationSubDoc[];
  serviceLocation: LocationSubDoc[];
  createdAt: Date;
  updatedAt: Date;
};

const LocationSchema = new Schema({
  placeId: { type: String },
  city: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  formattedString: { type: String },
});

export const ServiceAreaSchema = new Schema<ServiceAreaDoc>(
  {
    beauticianId: { type: Schema.Types.ObjectId },
    homeServiceLocation: { type: [LocationSchema],default:[] },
    serviceLocation: { type:[ LocationSchema], default:[] },
  },
  { timestamps: true }
);

export const ServiceAreaModel: Model<ServiceAreaDoc> =
  mongoose.models.ServiceArea ||
  mongoose.model("ServiceArea", ServiceAreaSchema);
