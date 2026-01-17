import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { UserRole } from "../../../../domain/enum/userEnum";

export type UserDoc=Document &{
  _id:Types.ObjectId
  email:string,
  userName:string,
  fullName:string,
  passwordHash:string,
  role:UserRole,
  profileImg?:string,
  isVerified:boolean,
  isActive:boolean,
   googleId?: string;
  createdAt:Date,
  updateAt:Date
}

const UserSchema=new Schema<UserDoc>(
  {
    email:{type:String,required:true,unique:true},
    userName:{type:String,required:true,unique:true},
    fullName:{type:String},
    passwordHash:{type:String},
    role:{type:String,enum:Object.values(UserRole) as UserRole[],default:UserRole.CUSTOMER},
    profileImg:{type:String,default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"},
    isVerified:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
       googleId: {
            type: String,
            required: false,
        },
  },{timestamps:true}
)


export const UserModel:Model<UserDoc>=mongoose.models.User || mongoose.model<UserDoc>("User",UserSchema)