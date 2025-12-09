import { FilterQuery, Types } from "mongoose";
import { IBeauticianDTO, IBeauticianProfileDTO, IBeauticianViewEditProfileDTO, ISearchBeauticianResultDto } from "../../../application/dtos/beautician";
import { Beautician } from "../../../domain/entities/Beautician";
import { VerificationStatus, VerificationStatusFilter } from "../../../domain/enum/beauticianEnum";
import { SortFilter } from "../../../domain/enum/sortFilterEnum";
import { IAddPaymentDetailsDto, IBeauticianRepository, IRegisterDto, IVerificationUpdate } from "../../../domain/repositoryInterface/IBeauticianRepository";
import { BeauticianDoc, BeauticianModel } from "../../database/models/beautician/BeauticianModel";
import { GenericRepository } from "../genericRepository";
import { ObjectId } from 'mongodb';
import { IBeauticianEditProfileInput, IBeauticianViewEditProfileOutput } from "../../../application/interfaceType/beauticianType";
import { toBeauticianSearchDto } from "../../../application/mapper/domain/beauticianDomainMapper";


export function toObjectId(id: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
}

export class mongoBeauticianRepository extends GenericRepository<Beautician,BeauticianDoc>  implements IBeauticianRepository{

  constructor() {
        super(BeauticianModel);
    }

  async create(data:IRegisterDto): Promise<Beautician> {
    const created=await BeauticianModel.create(data)
    return this.toDomain(created)
  }
  
   async findByUserId(userId: string): Promise<Beautician | null> {
    const doc = await BeauticianModel.findOne({ userId });
    return doc ? this.toDomain(doc) : null;
  }
   async findById(id: string): Promise<Beautician | null> {
    const doc = await BeauticianModel.findById(id); 
    return doc ? this.toDomain(doc) : null;
  }





async findAll(params: {
  sort?: SortFilter;
  verificationStatus?: VerificationStatusFilter;
  skip: number;
  limit: number;
}): Promise<IBeauticianDTO[]> {
  const filter: any = {};
  if (params.verificationStatus && params.verificationStatus !== "all") {
    filter.verificationStatus = params.verificationStatus;
  }

  const sortOrder = params.sort === SortFilter.ASC ? 1 : -1;

  const pipeline: any[] = [
    { $match: filter },
    { $sort: { createdAt: sortOrder } },
    { $skip: params.skip },
    { $limit: params.limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        userId: 1,
        profileImg: "$user.profileImg",
        userName: "$user.userName",
        verificationStatus: 1,
        yearsOfExperience: 1,
        shopName: 1,
        city: "$shopAddress.city"
      }
    }
  ];




  const docs = await BeauticianModel.aggregate(pipeline).exec();

  return docs.map((d: any) => ({
    userId: String(d.userId),
    profileImg: d.profileImg ?? "",
    userName: d.userName ?? "",
    verificationStatus: d.verificationStatus,
    yearsOfExperience: d.yearsOfExperience,
    shopName: d.shopName,
    city: d.city
  }));
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


async findProfileByUserId(userId: string): Promise<IBeauticianProfileDTO | null> {
    
    
  
    const { ObjectId } = require('mongodb');
  
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
    
      return null;
    }
    
    const pipeline: any[] = [
      { 
        $match: { 
          userId: userObjectId  
        } 
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: 1,
          profileImg: "$user.profileImg",
          userName: "$user.userName",
          yearsOfExperience: 1,
          shopName: 1,
          city: "$shopAddress.city",
          about: 1,
          shopAddress: 1,
          portfolioImage: 1,
          shopPhotos: 1,
          certificateImage: 1,
          hasShop: 1,
          verificationStatus: 1
        }
      }
    ];

    

    const docs = await BeauticianModel.aggregate(pipeline).exec();
    

    
    if (docs.length === 0) {
      return null;
    }

    const doc = docs[0];
    console.log('✅ Profile data:', doc);

    return {
      userId: String(doc.userId),
      profileImg: doc.profileImg ?? "",
      userName: doc.userName ?? "",
      yearsOfExperience: doc.yearsOfExperience,
      shopName: doc.shopName,
      city: doc.city,
      about: doc.about ?? "",
      shopAddress: doc.shopAddress,
      portfolioImage: doc.portfolioImage ?? [],
      shopPhotos: doc.shopPhotos ?? [],
      certificateImage: doc.certificateImage ?? [],
      hasShop: doc.hasShop ?? false,
    };
  }


async updateVerificationByUserId(
  userId: string,
  update: IVerificationUpdate
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

  if (update.verifiedBy !== undefined) {
    setFields.verifiedBy =
      update.verifiedBy && ObjectId.isValid(update.verifiedBy)
        ? new ObjectId(update.verifiedBy)
        : null;
  }

  

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    filter,
    { $set: setFields },
    { new: true }
  ).exec();

  return updatedDoc ? this.toDomain(updatedDoc) : null;
}





async addPaymentDetails(
  userId: string,
  data: IAddPaymentDetailsDto
): Promise<Beautician | null> {
  if (!Types.ObjectId.isValid(userId)) return null;
  const userOid = new Types.ObjectId(userId);

  const bankDetails = {
    accountHolderName: data.accountHolderName.trim(),
    accountNumber: data.accountNumber.trim(),
    ifscCode: data.ifscCode.toUpperCase().trim(),
    bankName: data.bankName.trim(),
    upiId: data.upiId?.trim() || ""
  };

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    { userId: userOid },
    { $set: { bankDetails } },
    { new: true }
  ).exec();

  return updatedDoc ? this.toDomain(updatedDoc) : null;
}


async updateByUserId(userId: string, data: IRegisterDto): Promise<Beautician | null> {
  const userOid = toObjectId(userId);
  if (!userOid) return null;

  const updatedDoc = await BeauticianModel.findOneAndUpdate(
    { userId: userOid },
    { $set: data },
    { new: true }
  ).exec();

  return updatedDoc ? this.toDomain(updatedDoc) : null;
}



async findProfileDeatilsById(userId: string): Promise<Beautician| null> {
     const userOid = toObjectId(userId);
    if (!userOid) return null;

    
    const beautician = await BeauticianModel.findOne({ userId: userOid })
      
      

    if (!beautician) return null;

   return this.toDomain(beautician)
    

}


async updateProfileDetailById(
  userId: string,
  data: Partial<Beautician>
): Promise<boolean> {

  const userOid = toObjectId(userId);
    if (!userOid) return false;

    const updateFields = this.mapToPersistence(data);
    
    if (Object.keys(updateFields).length === 0) {
      return true;
    }

    const result = await BeauticianModel.updateOne(
      { userId: userOid },
      { $set: updateFields }
    );

    return result.matchedCount > 0;
}






  private toDomain(doc:BeauticianDoc):Beautician{
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

      homeservicecount: doc.homeservicecount ?? 0,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }


  private mapToProfileDTO(doc: any): any {
    const user = doc.userId;
    
    return {
      id: doc._id.toString(),
      userId: user._id.toString(),
      userName: user.userName,
      fullName: user.fullName,
      profileImg: user.profileImg,
      about: doc.about,
      shopName: doc.shopName,
      shopAddress: doc.shopAddress,
      yearsOfExperience: doc.yearsOfExperience,
       accountHolderName: doc.bankDetails?.accountHolderName,
    accountNumber: doc.bankDetails?.accountNumber,
    ifscCode: doc.bankDetails?.ifscCode,
    bankName: doc.bankDetails?.bankName,
    upiId: doc.bankDetails?.upiId,
    };
  }



  private mapToPersistence(domain: Partial<Beautician>): Record<string, any> {
    const fields: Record<string, any> = {};

    if (domain.about !== undefined) fields.about = domain.about;
    if (domain.shopName !== undefined) fields.shopName = domain.shopName;
    if (domain.shopAddress !== undefined) fields.shopAddress = domain.shopAddress;
    if (domain.yearsOfExperience !== undefined) {
      fields.yearsOfExperience = domain.yearsOfExperience;
    }
    
  
    if (domain.bankDetails !== undefined) {
      fields.bankDetails = domain.bankDetails;
    }

    return fields;
  }
}


