import mongoose, { Document, Model, Schema, Types } from "mongoose"

export type OtpDoc=Document &{
    _id:Types.ObjectId,
    email:string,
    otpHash:string,
    expiresAt:Date,
    attempts:number,
    resendCount:number,
    createdAt:Date,
    signupToken?: string | null;
}

const OtpSchema=new Schema<OtpDoc>({
   email:{type:String,required:true,index:true},
   otpHash:{type:String,required:true},
   expiresAt:{type:Date,required:true},
   signupToken:{type:String,default:null},
   attempts:{type:Number,default:0},
   resendCount:{type:Number,default:0},
   createdAt:{type:Date,default:Date.now}
},{timestamps:true})


OtpSchema.index({expiresAt:1},{expireAfterSeconds:0})

export const OtpModel:Model<OtpDoc>=mongoose.models.Otp||mongoose.model<OtpDoc>("Otp",OtpSchema)

export default OtpModel