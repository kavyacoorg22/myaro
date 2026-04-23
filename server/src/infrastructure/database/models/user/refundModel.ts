import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { RefundMethod, RefundStatus, RefundType } from "../../../../domain/enum/paymentEnum";

export type RefundDoc=Document&{
    _id: Types.ObjectId
    userId:Types.ObjectId
    paymentId: Types.ObjectId
    amount: number
    method: RefundMethod
    status: RefundStatus
    refundType:RefundType,
    razorpayRefundId?: string
    reason?: string
    adminNote?:string
    createdAt: Date
    updatedAt:Date
    processedAt?: Date
}

export const RefundSchema=new Schema<RefundDoc>({
    userId:{type:Schema.Types.ObjectId},
   paymentId:{type:Schema.Types.ObjectId},
   amount:{type:Number},
   method:{type:String,enum:Object.values(RefundMethod)},
   status:{type:String,enum:Object.values(RefundStatus)},
   refundType:{type:String,enum:Object.values(RefundType)},
   razorpayRefundId:{type:String},
   processedAt:{type:Date},
   adminNote:{type:String}
},{timestamps:true})

export const RefundModel:Model<RefundDoc>=mongoose.models.Refund||mongoose.model<RefundDoc>('Refund',RefundSchema)