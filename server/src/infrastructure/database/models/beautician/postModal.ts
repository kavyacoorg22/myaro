import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { PostType } from "../../../../domain/enum/userEnum";
import { LocationVO } from "../../../../domain/entities/beauticianServiceAres";

export type PostDoc=Document&{
 _id:Types.ObjectId,
 beauticianId:Types.ObjectId,
  description?:string,
  postType:PostType,
  location?:LocationVO,
  media:string[],
  likesCount?:number,
  commentsCount?:number,
  createdAt:Date,
  updatedAt:Date
}

const LocationSchema = new Schema({
  city: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  formattedString: { type: String },
},{_id:false});


export const PostSchema=new Schema<PostDoc>({
   beauticianId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    description:{type:String},
    postType:{type:String,enum:Object.values(PostType),default:PostType.REEL,required:true},
    location:{type:LocationSchema},
    media:[{type:String,required:true}],
    likesCount:{type:Number,default:0},
    commentsCount:{type:Number,default:0},

},{timestamps:true})

export const PostModel:Model<PostDoc>=mongoose.models.Post||mongoose.model('Post',PostSchema)