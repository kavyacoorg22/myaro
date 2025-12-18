
import {  IUserRepository } from "../../domain/repositoryInterface/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel,UserDoc } from "../database/models/user/UserModel";
import { SortFilter } from "../../domain/enum/sortFilterEnum";
import { UserRole, UserRoleFilter } from "../../domain/enum/userEnum";
import { Types } from "mongoose";



export function toObjectId(id: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
}


export class MongoUserRepository implements IUserRepository{
    
  async create(dto:Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'>):Promise<User>
  {
    const created=await UserModel.create(dto)
    return this.toDomain(created)
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc=await UserModel.findOne({email}).exec();
    return doc?this.toDomain(doc):null
  }

  async findByUserName(userName: string): Promise<User | null> {
    const doc=await UserModel.findOne({userName}).exec();
    return doc?this.toDomain(doc):null
  }

  async findByUserId(id: string): Promise<User | null> {
    const doc=await UserModel.findOne({_id:id}).exec()
    return doc?this.toDomain(doc):null
  }

 async updatePassword(email: string, newPassword: string):Promise<User|null> {
  const doc = await UserModel.findOneAndUpdate(
    { email },                        
    { passwordHash: newPassword },    
    { new: true }                     
  );

  return doc ? this.toDomain(doc) : null;
}


async updateById(userId: string, data: Partial<User>): Promise<boolean> {
    const userOid = toObjectId(userId);
    if (!userOid) return false;

    

    const result = await UserModel.updateOne(
      { _id: userOid },
      { $set: data }
    );

    return result.matchedCount > 0;
  }


async findAll(params: {
    search?: string;
    sort?: SortFilter;
    role?: UserRoleFilter;
    skip: number;
    limit: number;
}): Promise<User[]> {

    const filter: any = {};

    if (params.role && params.role !== "all") {
        filter.role = params.role;
    }

   
    if (params.search) {
        const regex = new RegExp(params.search, "i");
        filter.$or = [
            { email: regex },
            { userName: regex },
            { fullName: regex }
        ];
    }

    const sortOrder = params.sort === SortFilter.ASC ? 1 : -1;

    const users = await UserModel
        .find(filter)
        .sort({ createdAt: sortOrder })
        .skip(params.skip)
        .limit(params.limit);

    return users.map(u => this.toDomain(u));
}

async countAll(params?: {
    search?: string;
    role?: UserRoleFilter;
}): Promise<number> {

    const filter: any = {};

    if (params?.role && params.role !== "all") {
        filter.role = params.role;
    }

    if (params?.search) {
        const regex = new RegExp(params.search, "i");
        filter.$or = [
            { email: regex },
            { userName: regex },
            { fullName: regex }
        ];
    }

    return UserModel.countDocuments(filter);
}

async isUserBlocked(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId).select("isActive");

    if (!user) return true;

    return user.isActive === false;
}

  async updateStatus(id: string, isActive: boolean):Promise<User|null>{
        const doc=await UserModel.findByIdAndUpdate(id, { isActive }, { new: true });
         return doc ? this.toDomain(doc) : null;
    }

  
    async updateRoleAndVerification(userId: string, role: UserRole, isVerified: boolean): Promise<User | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    const updated = await UserModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      {
        $set: {
          role,
          isVerified,
        },
      },
      { new: true }
    ).exec();

    return updated ? this.toDomain(updated) : null;
  }

   async update(id: string, data: Partial<User>): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateData: any = { ...data };
    
    
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const doc = await UserModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: updateData },
      { new: true }
    ).exec();

    return doc ? this.toDomain(doc) : null;
  }

  async updateProfileImageById(id: string, profileImg: string): Promise<User | null> {
    if(!Types.ObjectId.isValid(id)) return null;

    const updated=await UserModel.findByIdAndUpdate(id,{profileImg},{new:true})
    return updated?this.toDomain(updated):null
  }



async searchBeauticians(query: string): Promise<User[]> {
  const escaped = escapeRegex(query);
  const regex = new RegExp(escaped, 'i');

  const users = await UserModel.find({
    isVerified: true,
    isActive: true,
    role: 'beautician',
    $or: [
      { userName: regex },
      { fullName: regex }
    ]
  })
  .select('_id userName fullName profileImg')
  .limit(20)
  

  return users.map(u => this.toDomain(u));
}

async getBeauticiansById(id: string[]): Promise<User[]> {
  const users = await UserModel.find({
    _id:id,
    isVerified: true,
    isActive: true,
    role: 'beautician',
   
  })
  .select('_id userName fullName profileImg')
  .limit(20)
  

   return users.map(u => this.toDomain(u));
}

  private toDomain(doc:UserDoc):User{
    return{
      id:doc._id.toString(),
      email:doc.email,
      userName:doc.userName,
      fullName:doc.fullName,
      passwordHash:doc.passwordHash,
      role:doc.role,
      profileImg:doc.profileImg,
      isVerified:doc.isVerified,
      isActive:doc.isActive,
      createdAt:doc.createdAt,
      updatedAt:doc.updateAt
    }
  }

  
}

function escapeRegex(input:string):string{
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

}