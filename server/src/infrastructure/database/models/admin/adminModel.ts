import mongoose, { Document, Model, Schema, Types } from "mongoose"
import { UserRole } from "../../../../domain/enum/userEnum"


export type AdminDoc=Document &{
   _id:Types.ObjectId,
   email:string,
   passwordHash:string,
   role:UserRole,
   isActive:boolean,
   createdAt:Date,
   updatedAt:Date
}


const AdminSchema=new Schema<AdminDoc>(
  {
    email:{type:String,required:true,unique:true},
    passwordHash:{type:String,required:true},
    role:{type:String,enum:Object.values(UserRole) as UserRole[],default:UserRole.ADMIN},
    isActive:{type:Boolean,default:true}
  },{timestamps:true}
)


export const AdminModel:Model<AdminDoc>=mongoose.models.Admin || mongoose.model<AdminDoc>("Admin",AdminSchema)