import { PostType } from "../enum/userEnum";
import { LocationVO } from "./beauticianServiceAres";

export  interface Post{
 id:string,
 beauticianId:string,
 description?:string,
 postType:PostType,
 location?:LocationVO,
 media:string[],
 likesCount?:number,
 commentsCount?:number,
 createdAt:Date,
 updatedAt:Date
}