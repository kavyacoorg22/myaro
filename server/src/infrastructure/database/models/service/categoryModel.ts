import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { CategoryServiceType } from "../../../../domain/enum/serviceEnum";

export type CategoryDoc = Document & {
  _id: Types.ObjectId;
  name: string;
  type: CategoryServiceType;
  createdBy: Types.ObjectId;
  createdByModel: "Admin" | "Beautician";
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

const CategorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String },
    type: {
      type: String,
      enum: Object.values(CategoryServiceType),
      default: CategoryServiceType.SYSTEM,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: false,
    },
    createdByModel: {
      type: String,
      enum: ["Admin", "Beautician"],
      required: false,
      default: "Admin",
      validate: {
        validator: function (value: string) {
          if (this.type === CategoryServiceType.SYSTEM) {
            return value === "Admin";
          }
          return true;
        },
        message: "System category must be created by admin",
      },
    },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const categoryModel: Model<CategoryDoc> =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
