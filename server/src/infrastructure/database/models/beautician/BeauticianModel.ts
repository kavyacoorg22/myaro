import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ServiceModes, VerificationStatus } from "../../../../domain/enum/beauticianEnum";




export type BeauticianDoc =Document & {
  _id: Types.ObjectId;
  beauticianId:string,
  userId: Types.ObjectId;
  yearsOfExperience: number;
  serviceModes?:ServiceModes[],
  about: string;

  hasShop: boolean;

  shopName?: string;
  shopAddress?: {
    address: string;
    city: string;
    pincode: string;
  };

  shopPhotos?: string[];
  shopLicence?: string[];
  portfolioImage: string[];
  certificateImage: string[];

  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
  };

  verificationStatus: VerificationStatus;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;

  remark?: string;
  homeserviceCount?: number;
  pamphletUrl?: string;
  

  createdAt: Date;
  updatedAt: Date;
};

const ShopAddressSchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    pincode: { type: String },
  },
  { _id: false }
);

const BankDetailsSchema = new Schema(
  {
    accountHolderName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    upiId: { type: String },
  },
  { _id: false }
);

const BeauticianSchema = new Schema<BeauticianDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   
    yearsOfExperience: { type: Number, default: 0 },
    serviceModes:{type:[String],enum:Object.values(ServiceModes),default:[]},
    about: { type: String, default: "" },

    hasShop: { type: Boolean, default: false },

    shopName: { type: String },
    shopAddress: { type: ShopAddressSchema },

    shopPhotos: [{ type: String }],
    shopLicence: [{ type: String }],
    portfolioImage: [{ type: String }],
    certificateImage: [{ type: String }],

    bankDetails: { type: BankDetailsSchema },

    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },

    verifiedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    verifiedAt: { type: Date },


    homeserviceCount: { type: Number, default: 0 },
      pamphletUrl: { type: String },


  },
  { timestamps: true }
);

export const BeauticianModel:Model<BeauticianDoc>=mongoose.models.Beautician || mongoose.model('Beautician',BeauticianSchema)