import { AdminDoc, AdminModel } from "../../database/models/admin/adminModel";
import { UserRole } from "../../../domain/enum/userEnum";
import { Admin } from "../../../domain/entities/admin";
import { IAdminRepository } from "../../../domain/repositoryInterface/IAdminRepository";

export class MongoAdminRepository implements IAdminRepository {

  async findByEmail(email: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ email }).exec();
    return doc ? this.toDomain(doc) : null;
  }

 async findById(id: string): Promise<Admin| null> {
    const doc = await AdminModel.findById(id); 
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(doc: AdminDoc): Admin {
    
    const validRoles = (Object.values(UserRole) as string[]);
    const role = validRoles.includes(String(doc.role)) ? (doc.role as unknown as UserRole) : UserRole.ADMIN;

    return {
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      role,
      isActive:true,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
