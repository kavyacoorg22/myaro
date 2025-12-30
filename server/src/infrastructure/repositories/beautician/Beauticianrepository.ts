import {  Types } from "mongoose";
import { Beautician } from "../../../domain/entities/Beautician";
import {  VerificationStatusFilter } from "../../../domain/enum/beauticianEnum";
import { SortFilter } from "../../../domain/enum/sortFilterEnum";
import {  IBeauticianRepository} from "../../../domain/repositoryInterface/IBeauticianRepository";
import { BeauticianDoc, BeauticianModel } from "../../database/models/beautician/BeauticianModel";
import { GenericRepository } from "../genericRepository";
import { ObjectId } from 'mongodb';


export function toObjectId(id: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
}

export class mongoBeauticianRepository extends GenericRepository<Beautician,BeauticianDoc>  implements IBeauticianRepository{

  constructor() {
        super(BeauticianModel);
    }

  async create(data:Omit<Beautician, "id" | "createdAt" | "updatedAt">): Promise<Beautician> {
    const created=await BeauticianModel.create(data)
    return this.map(created)
  }
  
   async findByUserId(userId: string): Promise<Beautician | null> {
    const doc = await BeauticianModel.findOne({ userId });
    return doc ? this.map(doc) : null;
  }
   async findById(id: string): Promise<Beautician | null> {
    const doc = await BeauticianModel.findById(id); 
    return doc ? this.map(doc) : null;
  }





async findAll(params: {
  sort?: SortFilter;
  verificationStatus?: VerificationStatusFilter;
  skip: number;
  limit: number;
}): Promise<Beautician[]> {
  const filter: any = {};
  if (params.verificationStatus && params.verificationStatus !== "all") {
    filter.verificationStatus = params.verificationStatus;
  }

  const sortOrder = params.sort === SortFilter.ASC ? 1 : -1;


  const docs = await BeauticianModel.find(filter)
  .sort({createdAt:sortOrder})
  .skip(params.skip)
  .limit(params.limit)
  .exec()
  
   return docs.map((doc)=>this.map(doc))
}


async countAll(params?: {
    verificationStatus?: VerificationStatusFilter;
}): Promise<number> {

    const filter: any = {};

    if (params?.verificationStatus && params.verificationStatus !== "all") {
        filter.verificationStatus = params.verificationStatus;
    }

   

    return BeauticianModel.countDocuments(filter);
}




async updateVerificationByUserId(
  userId: string,
  update: Partial<Beautician>
): Promise<Beautician | null> {
 
  if (!ObjectId.isValid(userId)) return null;

  const filter = { userId: new ObjectId(userId) };

  
  const setFields: Record<string, unknown> = {};

  if (update.verificationStatus !== undefined) {
    setFields.verificationStatus = update.verificationStatus;
  }

  if (update.verifiedAt !== undefined) {
    setFields.verifiedAt = update.verifiedAt;
  }
if (update.verifiedBy !== undefined && update.verifiedBy && ObjectId.isValid(update.verifiedBy)) {
  setFields.verifiedBy = new ObjectId(update.verifiedBy);
}

  

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    filter,
    { $set: setFields },
    { new: true }
  ).exec();

  return updatedDoc ? this.map(updatedDoc) :null;
}





async addPaymentDetails(
  userId: string,
  data: Partial<Beautician>
): Promise<Beautician | null> {
  if (!Types.ObjectId.isValid(userId)) return null;
  const userOid = new Types.ObjectId(userId);

  const bankDetails = {
    accountHolderName: data.bankDetails?.accountHolderName.trim(),
    accountNumber: data.bankDetails?.accountNumber.trim(),
    ifscCode: data.bankDetails?.ifscCode.toUpperCase().trim(),
    bankName: data.bankDetails?.bankName.trim(),
    upiId: data.bankDetails?.upiId?.trim() || ""
  };

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    { userId: userOid },
    { $set: { bankDetails } },
    { new: true }
  ).exec();

  return updatedDoc ? this.map(updatedDoc) : null;
}


async updateByUserId(userId: string, data: Omit<Beautician, "id" | "createdAt" | "updatedAt"|'homeServiceCount'>): Promise<Beautician | null> {
  const userOid = toObjectId(userId);
  if (!userOid) return null;

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    { userId: userOid },
    { $set: data },
    { new: true }
  ).exec();

  return updatedDoc ? this.map(updatedDoc) : null;
}






async updateProfileDetailById(
  userId: string,
  data: Partial<Beautician>
): Promise<boolean> {

  const userOid = toObjectId(userId);
    if (!userOid) return false;

   

    const result = await BeauticianModel.updateOne(
      { userId: userOid },
      { $set: data }
    );

    return result.matchedCount > 0;
}






  protected map(doc:BeauticianDoc):Beautician{
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),

      yearsOfExperience: doc.yearsOfExperience,
      about: doc.about,

      hasShop: doc.hasShop,
      shopName: doc.shopName,

      shopAddress: doc.shopAddress
        ? {
            address: doc.shopAddress.address,
            city: doc.shopAddress.city,
            pincode: doc.shopAddress.pincode,
          }
        : undefined,

      shopPhotos: doc.shopPhotos ?? [],
      shopLicence: doc.shopLicence ?? [],
      portfolioImage: doc.portfolioImage ?? [],
      certificateImage: doc.certificateImage ?? [],

      bankDetails: doc.bankDetails
        ? {
            accountHolderName: doc.bankDetails.accountHolderName,
            accountNumber: doc.bankDetails.accountNumber,
            ifscCode: doc.bankDetails.ifscCode,
            bankName: doc.bankDetails.bankName,
            upiId: doc.bankDetails.upiId,
          }
        : undefined,

      verificationStatus: doc.verificationStatus,
      verifiedBy: doc.verifiedBy?.toString(),
      verifiedAt: doc.verifiedAt,

      homeserviceCount: doc.homeserviceCount ?? 0,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }







}


